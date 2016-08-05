var Image = require("../models/image")
module.exports = {
    index: function(req, res) {
        Image.find({}, function(err, images) {
            if (err) {
                console.log(err);
            }
            console.log(images);

            res.render("index", {
                images: images
            });
        });

    }
};
