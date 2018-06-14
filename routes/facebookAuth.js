var express = require('express');
var router = express.Router();
var passport = require('passport');

router.get('/', passport.authenticate('facebook', { scope : 'email' }));

router.get('/callback', passport.authenticate('facebook', {
				successRedirect : '/',
				failureRedirect : '/login'
			}));
			
/*
router.get('/callback',passport.authenticate('facebook'), function(req, res, next) {
		

	  return next();
  		
});*/


module.exports = router;
