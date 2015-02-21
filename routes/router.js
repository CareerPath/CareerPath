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
    	        
    	        return res.redirect('/search');
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
    				var count = 0;
    				async.map(data.connections.values, function (connection, cb) {
    					if (count > 2) return cb(null, {});
    					count++;
    					linkedin.people.id(connection.id,fields,function (err, data) {
    						var positions = [];
    						if (data.positions && data.positions._total > 0) {
    							data.positions = data.positions.values[0].title;
    						}
    						cb(err, data);
    					});
    				}, function (err, connections) {
    					json2csv({data: connections, fields: ['id','headline','positions','skills','specialties','interests','educations']}, function(err, csv) {
						  if (err) console.log(err);
						  res.send({csv:csv});
						  fs.writeFile('result.csv', csv, function(err) {
						    if (err) throw err;
						    console.log('file saved');
						  });
						});
    				});
    				
    			}
    		})
    	});
    },

};

module.exports = router;
