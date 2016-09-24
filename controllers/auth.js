var User = require("../models/user");
module.exports = {
    register: function(req, res, next) {

        if (req.body.email && req.body.firstname && req.body.lastname && req.body.password && req.body.confirmPassword) {

            if (req.body.password !== req.body.confirmPassword) {
                var err = new Error("password do not match");
                return next(err);
            }
            var userData = {
                email: req.body.email,
                name: req.body.name,
                favoriteBook: req.body.favoriteBook,
                password: req.body.password,
                username: req.body.username
            };
            User.create(userData, function(err, user) {
                if (err) {
                    return next(err);
                } else {
                    req.session.userId = user._id;
                    res.redirect("/");
                }
            });
        } else {
            console.log("something is missing");
        }

    },

    login: function(req, res, next) {
        if (req.body.email && req.body.password) {
            User.authenticate(req.body.email, req.body.password, function(err, user) {
                if (err || !user) {
                    var error = new Error("Wring email or password");
                    return next(error);
                } else {
                    req.session.userId = user._id;
                    console.log(req.session.userId)
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
