var query = require("querystring");
var settings = require("../settings");
var json2csv = require('json2csv');
var fs = require('fs');
var async = require('async');
var Linkedin = require('node-linkedin')(settings.api_key, settings.secret, settings.redirect_uri);
var linkedin;
var fields = ['id', 'first-name', 'last-name', 'maiden-name',
            'formatted-name', 'headline', 'location',
            'industry', 'current-share', 'num-connections', 'num-connections-capped',
            'summary', 'specialties', 'positions', 'picture-url','picture-urls::(original)',
            'email-address', 'last-modified-timestamp', 'associations', 'interests',
            'publications', 'patents', 'languages', 'skills', 'certifications',
            'educations', 'courses', 'volunteer', 'num-recommenders',
            'recommendations-received', 'mfeed-rss-url', 'following', 'job-bookmarks',
            'suggestions', 'date-of-birth', 'related-profile-views', 'honors-awards',
            'phone-numbers', 'bound-account-types', 'im-accounts', 'main-address',
            'twitter-accounts', 'primary-twitter-account', 'connections', 'group-memberships',
            'network', 'public-profile-url','api-standard-profile-request'];
var router = {
    setup :function(app){
    	app.get('/oauth/linkedin', function(req, res) {
    	    // This will ask for permisssions etc and redirect to callback url. 
    	    // var params = {
    	    // 	response_type: 'code',
    	    // 	client_id: settings.api_key,
    	    // 	redirect_uri: settings.redirect_uri,
    	    // 	state: 'cool'
    	    // }
    	    // res.redirect("https://www.linkedin.com/uas/oauth2/authorization?" + query.stringify(params));
    	    Linkedin.auth.authorize(res, ['r_basicprofile', 'r_fullprofile', 'r_emailaddress', 'r_network', 'r_contactinfo', 'rw_nus', 'rw_groups', 'w_messages']);
    	});
    	app.get('/oauth/linkedin/callback', function(req, res) {
    	    Linkedin.auth.getAccessToken(res, req.query.code, function(err, results) {
    	        if ( err )
    	            return console.err(err);
    	        results = JSON.parse(results);
    	        linkedin = Linkedin.init(results.access_token);
    	        
    	        return res.redirect('/');
    	    });
    	});
    	app.get('/search', function (req, res) {
    		if (linkedin == undefined)
    			return res.redirect('/oauth/linkedin');
    		linkedin.people.me(function (err, data) {
    			if (err) {
    				res.send({err:err});
    			} else {
    				var connections = [];
    				var count=0;
    				res.end("Started");
    				var limit = req.query.limit||20;
    				async.mapSeries(data.connections.values, function (connection, cb) {
    					if (count++ > limit) return cb(null, {});
    					console.log(count);
    					linkedin.people.id(connection.id,fields,function (err, data) {
    						if (err) return console.log("ERROR:" + err);
    						if (!data['publicProfileUrl']){
    							console.log(data);
    							return cb(null, {});
    						}
    						setTimeout(function() {
    							var exec = require('child_process').exec,
    						    child;
    							child = exec('linkedin-scraper '+data['publicProfileUrl'],
    							  function (error, stdout, stderr) {
    							    console.log('stderr: ' + stderr);
    							    if (stderr) return cb(null,{});
    							    var data = JSON.parse(stdout);
    							    if (data.title)
    							    	data.title = data.title.replace(/,/g, '.');
    							    if (data.summary)
    							    	data.summary = data.summary.replace(/,/g, '.')
    							    if (data.education) {
    							    	var education = '';
	    							    data.education.forEach(function (school) {
	    							    	education += "|" + school.name.replace(/,/g, '.');
	    							    })
	    							    data.education = education;
    							    }
    							    if (data.skills) {
    							    	var skills = '';
    							    	data.skills.forEach(function (skill) {
    							    		skills += "|" + skill.replace(/,/g, '.');
    							    	})
    							    	data.skills = skills;
    							    }
    							    
    							    cb(null, data);
    							    if (error !== null) {
    							      console.log('exec error: ' + error);
    							    }
    							});
    						}, 15000+Math.random()* 15000);
    						
    					});
    				}, function (err, connections) {
    					fs.writeFile('result.json', JSON.stringify(connections), function(err) {
						    if (err) throw err;
						    console.log('file saved');
						  });
    				});
    				
    			}
    		})
    	});
    },

};

module.exports = router;
