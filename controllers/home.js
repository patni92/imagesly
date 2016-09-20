var Image = require("../models/image");
var sidebar = require("./sidebar");
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
                    view.layout = "main";
                    res.render("index",view);
                });

            });

        }
    }
};
