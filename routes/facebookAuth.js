var express = require('express');
var router = express.Router();
var passport = require('passport');

router.get('/', passport.authenticate('facebook', { scope : 'email' }));

router.get('/callback', passport.authenticate('facebook', { successRedirect : '/', failureRedirect : '/login' } ) );

module.exports = router;
