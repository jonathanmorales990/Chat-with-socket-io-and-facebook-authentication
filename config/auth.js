// config/auth.js

// expose our config directly to our application using module.exports
module.exports = {

	'facebookAuth' : {
		'clientID' 		: '1384886724907362', // your App ID
		'clientSecret' 	: '8b50d21d1e31ee1a535c393afcefd774', // your App Secret
		'callbackURL' 	: 'http://localhost:8080/auth/facebook/callback'
	}

};