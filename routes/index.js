var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {});
});
router.get('/input-profile', function(req, res, next) {
  res.render('inputProfile', {me:req.session.me});
});

router.get('/career-match', function(req, res, next) {
	if (!req.session.me) {
		res.redirect('input-profile');
	} else {
		console.log(req.session.me);
		res.render('career-match', {me:req.session.me});
	}
});

module.exports = router;
