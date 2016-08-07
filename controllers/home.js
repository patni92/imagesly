var Image = require("../models/image");
var sidebar = require("./sidebar");
module.exports = {
    index: function(req, res) {
        var view = {

        };
        Image.find({}, function(err, images) {
            if (err) {
                console.log(err);
            }

            view.images = images;

            sidebar.sidebar(view, function() {
                
                res.render("index", view);
            });

        });

    }
};
