var User = require('../models/user');
var LocalStrategy = require('passport-local').Strategy;
var bCrypt = require("bcrypt");
var fbConfig = require("../authconfig.js").facebook;
var FacebookStrategy = require('passport-facebook').Strategy;

module.exports = function(passport) {
    passport.serializeUser(function(user, done) {
        done(null, user._id);
    });

    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

    passport.use("local-login", new LocalStrategy({
            usernameField: "email",
            passwordField: "password",
            passReqToCallback: true
        },
        function(req, email, password, done) {
            User.findOne({
                email: email
            }, function(err, user) {
                if (err) {
                    return done(err);
                }
                if (!user || !isValidPassword(user, password)) {
                    return done(null, false, req.flash('message', 'Wrong username or password'));
                }

                return done(null, user);
            });
        }
    ));

    passport.use(new FacebookStrategy({
    clientID: fbConfig .clientID,
    clientSecret: fbConfig .clientSecret,
    callbackURL: fbConfig .callbackURL,
    profileFields: ['id', 'email', 'first_name', 'last_name', 'picture'],
  },
  function(token, refreshToken, profile, done) {
      console.log(profile.photos[0].value);
    process.nextTick(function() {
      User.findOne({ 'fb.id': profile.id }, function(err, user) {
        if (err)
          return done(err);
        if (user) {
          return done(null, user);
        } else {

          var newUser = new User();
          newUser.gravatarImg = profile.photos[0].value;
          newUser.fb.id = profile.id;
          newUser.username = profile.name.givenName + "_" + profile.name.familyName;
          newUser.fb.token = token;
          newUser.fb.name = profile.name.givenName + ' ' + profile.name.familyName;
          newUser.fb.email = (profile.emails[0].value || '').toLowerCase();

          newUser.save(function(err) {
            if (err)
              throw err;
            return done(null, newUser);
          });
        }
      });
    });
  }));




    var isValidPassword = function(user, password) {
        return bCrypt.compareSync(password, user.password);
    }
}
