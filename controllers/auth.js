var User = require("../models/user");
var gravatar = require("gravatar");
var bcrypt = require("bcrypt");
var generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
};

module.exports = {
    register: function(req, res, next) {

        if (req.body.email && req.body.firstname && req.body.lastname && req.body.password && req.body.confirmPassword) {

            if (req.body.password !== req.body.confirmPassword) {

                 req.flash("error", "password don't match ");
                 return res.redirect("/#signup");

            }
            var userData = {
                email: req.body.email,
                name: req.body.name,
                password: generateHash(req.body.password),
                username: req.body.username,
                gravatarImg:  gravatar.url(req.body.email)
            };
            User.create(userData, function(err, user) {
                if (err) {
                    if(err.code === 11000) {
                        req.flash("error", "Email already in use");
                        return res.redirect("/#signup");
                    }
                    console.log(err.code);
                    return next(err);
                } else {
                    req.session.passport = {user: user._id}
                    res.redirect("/");
                }
            });
        } else {
            req.flash("error", "Fill in all fields");
            return res.redirect("/#signup" );
        }

    },

    login: function(req, res, next) {
        if (req.body.email && req.body.password) {
            User.authenticate(req.body.email, req.body.password, function(err, user) {
                if (err || !user) {
                    req.flash("loginError", "Wrong email or password");
                    return res.redirect("/");
                } else {
                    req.session.passport = {user: user._id}

                    return res.redirect("/");
                }
            });
        } else {
            var error = new Error("Email and password are required")
            return next(error);
        }
    },

    logout: function(req, res, next) {
        req.session.destroy(function(err) {
            return res.redirect("/");
        })
    }
};
