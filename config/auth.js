// config/auth.js

// expose our config directly to our application using module.exports
module.exports = {

	'facebookAuth' : {
		'clientID' 		: '180068836015039', // your App ID
		'clientSecret' 	: 'df26bb79969e62ab72822128b3ca2a14', // your App Secret
		'callbackURL' 	: 'https://fortalk.herokuapp.com/auth/facebook/callback'
	}

};