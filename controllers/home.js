var Image = require("../models/image");
var sidebar = require("./sidebar");
var User = require("../models/user");
module.exports = {
    index: function(req, res) {
        var view = {};

        if (!req.session.userId) {

            view.layout = "empty";
            res.render("login", view);
        } else {
            Image.find({}, function(err, images) {
                if (err) {
                    console.log(err);
                }

                view.images = images;

                sidebar.sidebar(view, function() {
                    User.findById(req.session.userId, function(err, user) {
                        view.gravatarImg = user.gravatarImg;
                        view.layout = "main";
                        console.log(view);
                        res.render("index",view);
                    });
                });

            });

        }
    }
};
