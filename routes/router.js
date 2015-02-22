var query = require("querystring");
var settings = require("../settings");
var json2csv = require('json2csv');
var fs = require('fs');
var async = require('async');
var Profile = require('../model/Profile');
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
var Linkedin;
var router = {
    setup :function(app){
        var redirect_uri;
        if (app.get('env') === 'production') {
            redirect_uri = settings.product_redirect_uri;
        } else {
            redirect_uri = settings.local_redirect_uri;
        }
        Linkedin = require('node-linkedin')(settings.api_key, settings.secret, redirect_uri);
        app.post('/upload', function (req, res) {
            var fstream;
            req.pipe(req.busboy);
            req.busboy.on('file', function (fieldname, file, filename) {
                console.log("Uploading: " + filename); 
                fstream = fs.createWriteStream('/tmp/' + filename);
                file.pipe(fstream);
                fstream.on('close', function () {
                    res.send({msg:"success"});
                });
            });
        });
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
    	        linkedin.people.me(function (err, data) {
                    if (err)
                        res.send({err: err});
                    else {
                        req.session.me = data;
                        console.log(data);
                        return res.redirect('/input-profile');
                    }
                })
    	    });
    	});
        app.get('/collect-jobs', function (req, res) {
            if (linkedin == undefined)
                return res.redirect('/oauth/linkedin');
            linkedin.jobs.id("29466592", function (err, data) {
                if (err)
                    res.send(err);
                else
                    res.send(data);
            });
        })
    	app.get('/collect-people', function (req, res) {
    		if (linkedin == undefined)
    			return res.redirect('/oauth/linkedin');
    		linkedin.people.me(function (err, data) {
    			if (err) {
    				res.send({err:err});
    			} else {
    				var connections = [];
    				var count=0;
    				res.end("Started");
    				var limit = req.query.limit||-1;
    				async.mapSeries(data.connections.values, function (connection, cb) {
    					if (count++ > limit) return cb(null, {});
    					console.log(count);
                        Profile.findOne({id:connection.id}, function (err, doc) {
                            if (!doc) {
                                linkedin.people.id(connection.id,fields,function (err, data) {
                                    if (err) return console.log("ERROR:" + err);
                                    if (!data['publicProfileUrl']){
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
                                            data.id = connection.id;
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
                                            var newProfile = new Profile(data);
                                            newProfile.save(function (err, doc) {
                                                console.log(err, doc);
                                                cb(err, data);
                                            })
                                            
                                            if (error !== null) {
                                              console.log('exec error: ' + error);
                                            }
                                        });
                                    }, 10000+Math.random()* 15000);
                                    
                                });
                            } else {
                                cb(err, doc);
                            }
                        })
    				}, function (err, connections) {
    					fs.writeFile('result.json', JSON.stringify(connections, null, 2), function(err) {
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
