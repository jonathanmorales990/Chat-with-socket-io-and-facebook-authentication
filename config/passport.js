var FacebookStrategy = require('passport-facebook').Strategy;
var LocalStrategy    = require('passport-local').Strategy;

// load up the user model
var User = require('../models/User');

// load the auth variables
var configAuth = require('../config/auth');

module.exports = function(passport) {
  
  passport.serializeUser(function(user, done) {      
       return done(null, user.id);
  });
  // used to deserialize the user
  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      return done(err, user);
    });
  });
  
  // =========================================================================
  // FACEBOOK LOGIN ========================================================
  // =========================================================================
  passport.use(new FacebookStrategy({
        clientID        : configAuth.facebookAuth.clientID,
        clientSecret    : configAuth.facebookAuth.clientSecret,
        callbackURL     : configAuth.facebookAuth.callbackURL,
        passReqToCallback : true,
        profileFields: ['id', 'email', 'gender', 'link', 'locale', 'name','picture.type(large)', 'timezone', 'updated_time', 'verified'],
  }, 
    function(req, token, refreshToken, profile, done) {
      var data = JSON.parse(profile._raw);
        // asynchronous
        process.nextTick(function() {
            // check if the user is already logged in
          if (!req.user) {
            User.findOne({ 'facebook.id' : profile.id }, function(err, user) {
              
              if (err) return done(err);
              
              if (user) {
                // if there is a user id already but no token (user was linked at one point and then removed)
                if (!user.facebook.token) {
                  
                  user.facebook.token = token;
                  user.facebook.name  = profile.name.givenName + ' ' + profile.name.familyName;
                  user.facebook.email = profile.emails[0].value;
                  user.facebook.photo = data.picture.data.url;
                  
                  user.save(function(err) {
                    if (err) return err;
                    
                    return done(null, user);
                  });
                } else { return done(null, user); }

                // user found, return that user
              } else {
                // if there is no user, create them
                var newUser = new User();

                newUser.facebook.id = profile.id;
                newUser.facebook.token = token;
                newUser.facebook.name = profile.name.givenName + ' ' + profile.name.familyName;
                newUser.facebook.email = profile.emails[0].value;
                newUser.facebook.photo = data.picture.data.url;

                newUser.save(function(err) {
                    if (err) return err;

                    return done(null, newUser);
                });
              }
          });

        } else {
                // user already exists and is logged in, we have to link accounts
                var user            = req.user; // pull the user out of the session

                user.facebook.id    = profile.id;
                user.facebook.token = token;
                user.facebook.name  = profile.name.givenName + ' ' + profile.name.familyName;
                user.facebook.email = profile.emails[0].value;
                user.facebook.photo = data.picture.data.url;

                user.save(function(err) {
                    if (err)
                        return err;
                    return done(null, user);
                });

            }
        });

    }));
    // =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================
    passport.use('local-login', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass in the req from our route (lets us check if a user is logged in or not)
    }, function(req, email, password, done) {
        // asynchronous
        process.nextTick(function() {
          User.findOne({ 'local.email' :  email }, function(err, user) {
                // if there are any errors, return the error
                if (err) return done(err);
                // if no user is found, return the message
                if (!user) return done(null, false, req.flash('loginMessage', 'Usuário não encontrado'));
                

                if (!user.validPassword(password)){
                    return done(null, false, req.flash('loginMessage', 'Oops! Senha inválida'));
                }
                // all is well, return user
                else{
                    return done(null, user);
                }
            });
        });
    }));
    
    // =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================
    passport.use('local-signup', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass in the req from our route (lets us check if a user is logged in or not)
    }, function(req, email, password, done) {
        // asynchronous
        process.nextTick(function() {
            //  Whether we're signing up or connecting an account, we'll need
            //  to know if the email address is in use.
            User.findOne({'local.email': email}, function(err, existingUser) {

                // if there are any errors, return the error
                if (err)
                    return done(err);

                // check to see if there's already a user with that email
                if (existingUser) 
                    return done(null, false, req.flash('signupMessageError', 'Este email já está em uso'));
                //  If we're logged in, we're connecting a new local account.
                if(req.user) {
                    var user                 = req.user;
                    user.local.email         = email;
                    user.local.password      = user.generateHash(password);
                    newUser.local.nome       = req.body.nome;
                    newUser.local.sobrenome  = req.body.sobrenome;
                    newUser.local.nomecompleto  = req.body.nome + " " + req.body.sobrenome;

                    user.save(function(err) {
                        if (err)
                            throw err;
                        return done(null, user);
                    });
                } 
                //  We're not logged in, so we're creating a brand new user.
                else {
                    // create the user
                    var newUser = new User();

                    newUser.local.email = email;
                    newUser.local.password = newUser.generateHash(password);
                    newUser.local.nome = req.body.nome;
                    newUser.local.sobrenome = req.body.sobrenome;
                    newUser.local.nomecompleto = req.body.nome + " " + req.body.sobrenome;
                    newUser.save(function(err) {
                        if (err)
                            throw err;

                        return done(null, newUser, req.flash('signupMessageSucess', 'Cadastrado com sucesso!'));
                    });
                }
            });
        });
    }));
};
