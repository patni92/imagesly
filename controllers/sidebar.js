var Image = require("../models/image");
var Comment = require("../models/comment");
var async = require('async');
module.exports = {
    sidebar: function(view, callback) {

        Image.find().sort({ likes: -1 }).limit(6).exec(function(err, images) {

            if (err) {
                console.log(err);
            } else {
                view.popularImages = images;
                var testArray = [];

                Comment.find({}, {}, { limit: 5, sort: { 'timestamp': -1 } }, function(err, comments) {

                    if (err) {
                        console.log(err);
                    } else {
                        var testArray = [];

                        list = [];

                        function asyncLoop(i, cb) {
                            if (i < comments.length) {
                                Image.findById(comments[i].image_id).exec(function(err, image) {
                                   
                                    image.lol = "hello";
                                    list.push({
                                      relatedImage: image,
                                      comments: comments[i]
                                    });
                                    asyncLoop(i + 1, cb);
                                });
                            } else {
                                cb();
                            }
                        }





                        asyncLoop(0, function() {
                            view.newComments = list;
                            console.log(view.newComments);
                        callback();
                        });
                      




                        

                    }



                });

            }


        });
    }
};
