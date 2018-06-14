var express = require('express');
var router = express.Router();
var passport = require('passport');

var User = require('../models/User');

router.get('/facebook',isLoggedIn, function(req, res) { 
		var user = req.user;
		req.user = null;
		req.logout();
		res.redirect('/login');
		
	});

router.get('/local',isLoggedIn, function(req, res) {
		var user = req.user;
		req.user = null;
		req.logout();
		res.redirect('/login');
					
	});


function isLoggedIn(req, res, next) {
	 if(req.isAuthenticated()){
      //if user is looged in, req.isAuthenticated() will return true 
      return next();
      
    } else{

      return res.redirect(303,"/login");
    
    }
}

module.exports = router;
