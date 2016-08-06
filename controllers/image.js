var Image = require("../models/image");
var Comment = require("../models/comment");
var path = require("path");
var fs = require("fs");
var sanitizeHtml = require('sanitize-html');


module.exports = {
    newImage: function(req, res) {
        function storImage() {
            var imageName = Math.random().toString(36).substr(2, 9);

            Image.findOne({ filname: imageName }, function(err, image) {

                if (image) {
                    storImage();
                } else {
                    var extension = path.extname(req.files[0].originalname);
                    console.log(extension);
                    var filePath = req.files[0].path;
                    var tempName = req.files[0].filename;

                    if (extension === ".png" || extension === ".jpeg" || extension === ".jpg" || extension === ".gif") {
                        fs.rename(filePath, "./public/uploads/" + imageName + extension, function(err, file) {
                            if (err) {
                                console.log(err);
                            }
                        });

                        var newImage = new Image({
                            title: req.body.title,
                            filename: imageName + extension,
                            description: req.body.description,

                        }).save();
                    } else {
                        fs.unlink(filePath, function() {
                            console.log("file removed");
                        });
                    }
                }

            });

            res.redirect("/image/" + imageName);
        }

        storImage();


    },

    showImage: function(req, res) {
        Image.findOne({ filename: { $regex: req.params.idImage } }, function(err, image) {
          
            res.render("showImage", image);
        });

    },

    newComment: function(req, res) {
        
        var cleanData = sanitizeHtml(req.body.comment, {
            allowedTags: [],
            allowedAttributes: []
        });
        

        if(cleanData.length === 0 ) {
          res.status(400).send({ error: "Invalid value" });
        } else {
          res.json(cleanData);
          Image.findOne({ filename: { $regex: req.params.idImage } }, function(err, image) {
          image.comments.push({ text:  cleanData });
          image.save( function (err) {
            if(err) {
              console.log(err);
            }
          });
         });
        }
        
    }
};
