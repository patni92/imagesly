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
                return res.redirect("/imagesly/#signup");

            }
            var userData = {
                email: req.body.email,
                name: req.body.name,
                password: generateHash(req.body.password),
                username: req.body.username,
                gravatarImg: gravatar.url(req.body.email)
            };
            User.create(userData, function(err, user) {
                if (err) {

                    if (err.code === 11000) {
                        req.flash("error", "Email or username already in use");
                        return res.redirect("/imagesly/#signup");
                    }

                    return next(err);
                } else {
                    req.session.passport = {
                        user: user._id
                    };

                    res.redirect("/");
                }
            });
        } else {

            console.log(res.error);
            req.flash("error", "Fill in all fields");
            return res.redirect("/imagesly/#signup");
        }

    },

    logout: function(req, res) {
        if (req.session) {
            req.logout();
            return res.redirect("/imagesly");
        }

    }
};
