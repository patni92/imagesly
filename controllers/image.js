var Image = require('../models/image');
var Comment = require('../models/comment');
var path = require('path');
var fs = require('fs');
var sanitizeHtml = require('sanitize-html');
var sidebar = require('./sidebar');
var Like = require("../models/like");
var User = require("../models/user");
var sharp = require("sharp");

module.exports = {
    newImage: function(req, res, next) {

        function storeImage() {
            var imageName = "e" + Math.random().toString(36).substr(2, 9);

            Image.findOne({
                filname: imageName
            }, function(err, image) {

                if (image) {
                    storeImage();
                } else {
                    var ext = path.extname(req.files[0].originalname);

                    var filePath = req.files[0].path;

                    if (ext === ".png" || ext === ".jpeg" ||
                        ext === ".jpg" || ext === ".gif") {

                        sharp(filePath)
                            .resize(800)
                            .toFile("./public/uploads/e" + imageName + ext, function(err) {

                                if (err) {
                                    return next(err);
                                } else {
                                    sharp.cache({
                                        files: 0
                                    });

                                    sharp.cache(false);
                                    sharp(filePath)
                                        .resize(300)
                                        .toFile("./public/uploads/thumbnails/e" + imageName + ext, function(err) {

                                            if (err) {
                                                return next(err);
                                            } else {
                                                fs.unlink(filePath, function(err) {
                                                    if (err) {
                                                        return next(err);
                                                    }

                                                    return res.redirect("/image/" + imageName);
                                                });

                                            }
                                        });
                                }
                            });

                        var newImage = new Image({
                            title: req.body.title,
                            filename: "e" + imageName + ext,
                            description: req.body.description,
                            user: req.session.passport.user
                        }).save();

                    } else {
                        fs.unlink(filePath, function() {
                            req.flash("error", "Not a valid file extension");
                            return res.redirect("/");

                        });

                    }
                }

            });

        }

        if (req.body.title.length > 70) {
            req.flash("error", "Title to long - maxium length is 70 characters");
            return res.redirect("/");

        } else if (req.body.description.length > 600) {
            req.flash("error", "Description is to long - maxium length is 600 characters");
            return res.redirect("/");
        }

        if (req.body.title && req.body.description && req.files[0]) {
            storeImage();

        } else {
            req.flash("error", "Fill in all fields");
            return res.redirect("/");
        }

    },

    deleteImage: function(req, res, next) {
        Image.findOne({
            filename: {
                $regex: req.params.idImage
            }
        }, function(err, image) {
            if (err) {
                return next(err);
            }

            if (image) {
                Comment.remove({
                    image_id: image._id
                }, function(err) {
                    if (err) {
                        return next(err);
                    }

                    fs.unlink("./public/uploads/" + image.filename, function(err) {
                        if (err) {
                            return next(err);
                        }

                        console.log("File deleted successfully!");
                    });

                    fs.unlink("./public/uploads/thumbnails/" + image.filename, function(err) {

                        if (err) {
                            return next(err);
                        }

                    });

                    Image.remove({
                        _id: image._id
                    }, function(err) {
                        if (err) {
                            return next(err);
                        }

                        res.redirect("/");
                    });
                });

            } else {
                return res.render("/");
            }

        })
    },

    showImage: function(req, res, next) {
        Image.findOne({
                filename: {
                    $regex: req.params.idImage
                }
            })
            .populate("comments").exec(function(err, image) {
                if (!image) {
                    return next();
                }

                var view = {
                    image: image
                };

                User.findById(req.session.passport.user, function(err, user) {

                    view.gravatarImg = user.gravatarImg;

                    view.currentUser = req.session.passport.user;

                    sidebar.sidebar(view, function() {

                        res.render("showImage", view);
                    });
                });

            });

    },

    newComment: function(req, res) {

        var cleanData = sanitizeHtml(req.body.comment, {
            allowedTags: [],
            allowedAttributes: []
        });

        if (cleanData.length === 0) {
            res.status(400).send({
                error: "Invalid value"
            });

        } else {
            Image.findOne({
                    filename: {
                        $regex: req.params.idImage
                    }
                },
                function(err, image) {
                    Comment.create({
                        text: cleanData
                    }, function(err, comment) {
                        if (err) {
                            console.log(err);
                        } else {
                            User.findById(req.session.passport.user, function(err, user) {

                                comment.image_id = image._id;
                                comment.gravatarImg = user.gravatarImg;
                                comment.username = user.username;
                                comment.user_id = user._id;
                                comment.save();
                                image.comments.unshift(comment);
                                image.save();
                                res.json({
                                    data: cleanData,
                                    username: comment.username,
                                    link: "/image/" + image.linkId + "/comment/" + comment._id + "?_method=DELETE"
                                });
                            });
                        }
                    });

                });
        }

    },

    deleteComment: function(req, res, next) {
        Image.update({}, {
            $pull: {

                comments: req.params.comment_id
            }
        }, {
            multi: true
        }, function(err) {
            if (err) {
                return next(err);
            }

            Comment.remove({
                _id: req.params.comment_id
            }, function(err) {

                if (err) {
                    return next(err);
                }

                res.redirect("/image/" + req.params.idImage);
            });
        });

    },

    like: function(req, res) {
        Image.findOne({
                filename: {
                    $regex: req.params.idImage
                }
            },
            function(err, image) {
                if (err) {
                    console.log(err);
                }

                Like.findOne({
                    image: image._id,
                    user: req.session.passport.user
                }, function(err, likeObj) {
                    if (err) {
                        console.log(err);
                        return;
                    };

                    if (!likeObj) {
                        Like.create({
                            image: image._id,
                            user: req.session.passport.user
                        });

                        image.likes = image.likes + 1;

                    } else {
                        likeObj.remove();

                        image.likes = image.likes - 1;

                    }

                    image.save(function(err) {
                        if (err) {
                            res.json(err);
                        } else {
                            res.json({
                                likes: image.likes
                            });
                        }
                    });

                });

            });
    }
};
