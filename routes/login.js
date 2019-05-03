var express = require('express');
var router = express.Router();
var passport = require('passport');


router.get('/', jaTaLogado, function(req, res, next) {
	return res.render('login.ejs',  { message: req.flash('loginMessage'),title: 'Login' });
});

router.post('/',jaTaLogado, passport.authenticate('local-login', {
	successRedirect : '/', // redirect to the secure profile section
	failureRedirect : '/login', // redirect back to the signup page if there is an error
	failureFlash : true // allow flash messages
}));

function jaTaLogado(req, res, next) {
	if (req.isAuthenticated()) {//if user is looged in, req.isAuthenticated() will return true 
		return res.redirect(303,"/");
	} else {
		return next();
	}
}

module.exports = router;
