var Image = require("../models/image");
var sidebar = require("./sidebar");
var User = require("../models/user");

module.exports = {
    index: function(req, res) {
        var view = {};

        Image.find({}).limit(3).sort({
            _id: -1
        }).exec(function(err, images) {

            if (err) {
                console.log(err);
            }

            view.images = images;

            sidebar.sidebar(view, function() {

                User.findById(req.session.passport.user, function(err, user) {
                    view.gravatarImg = user.gravatarImg;
                    view.layout = "main";

                    res.render("index", view);
                });
            });

        });

    }
};
