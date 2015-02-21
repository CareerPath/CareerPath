var oauth2lib = require('oauth20-provider');
var query = require("querystring");
oauth2 = new oauth2lib({log:{level:2}});

function isAuthorized (req, res, next) {
	if (req.session.authorized) next();
	else {
		var params = req.query;
		params.backUrl = req.path;
		res.redirect('/login?' + query.stringify(params));
	}
}

var router = {
    setup :function(server){
        server.use(oauth2.inject());
        server.post('/token', oauth2.controller.token);
        server.get('/authorization', isAuthorized,
        	oauth2.controller.authorization, function (req, res) {
        	res.render('authorization', {layout: false});
        });
        server.post('/authorization', isAuthorized, oauth2.controller.authorization);
    },

};

module.exports = router;
