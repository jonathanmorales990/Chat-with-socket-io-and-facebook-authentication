var express = require('express');
var router = express.Router();
var passport = require('passport');


router.get('/', function(req, res, next) {

	return res.render('cadastro.ejs',  {	
		messageErro: req.flash('signupMessageError'), 
		messageSucesso: req.flash('signupMessageSucess'), 
		title: 'Cadastro' 
	});
  
});

router.post('/', passport.authenticate('local-signup', {

	successRedirect : '/cadastro', 
	failureRedirect : '/cadastro', // redirect back to the signup page if there is an error
	failureFlash : true, // allow flash messages
	session:false

}));


module.exports = router;
