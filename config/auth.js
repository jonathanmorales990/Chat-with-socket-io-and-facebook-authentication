// config/auth.js

// expose our config directly to our application using module.exports
module.exports = {

	'facebookAuth' : {
		'clientID' 		: process.env.FACEBOOK_clientID, // your App ID
		'clientSecret' 	: process.env.FACEBOOK_clientSecret, // your App Secret
		'callbackURL' 	: process.env.FACEBOOK_callbackURL //looks like http://localhost/auth/facebook/callback
	}

};