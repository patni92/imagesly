var Image = require("../models/image");
var Comment = require("../models/comment");
module.exports = {
    sidebar: function(view, callback) {
        Image.find().sort({
            likes: -1
        }).limit(6).exec(function(err, images) {

            if (err) {
                console.log(err);

            } else {
                view.popularImages = images;
                Comment.find({}, {}, {
                    limit: 6,
                    sort: {
                        "timestamp": -1
                    }
                }, function(err, comments) {

                    if (err) {
                        console.log(err);
                    } else {

                        var list = [];

                        function asyncLoop(i, callback) {
                            if (i < comments.length) {
                                Image.findById(comments[i].image_id).exec(function(err, image) {

                                    list.push({
                                        relatedImage: image,
                                        comments: comments[i]
                                    });
                                    asyncLoop(i + 1, callback);
                                });

                            } else {
                                callback();
                            }
                        }

                        asyncLoop(0, function() {
                            view.newComments = list;

                            callback();
                        });

                    }

                });

            }

        });
    }
};
