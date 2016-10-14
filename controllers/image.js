var Image = require('../models/image');
var Comment = require('../models/comment');
var path = require('path');
var fs = require('fs');
var sanitizeHtml = require('sanitize-html');
var sidebar = require('./sidebar');
var Like = require("../models/like");
var User = require("../models/user");

module.exports = {
    newImage: function(req, res, next) {


        function storeImage() {
            var imageName = Math.random().toString(36).substr(2, 9);

            Image.findOne({
                filname: imageName
            }, function(err, image) {

                if (image) {
                    storeImage();
                } else {
                    var ext = path.extname(req.files[0].originalname);

                    var filePath = req.files[0].path;
                    var tempName = req.files[0].filename;

                    if (ext === '.png' || ext === '.jpeg' ||
                        ext === '.jpg' || ext === '.gif') {
                        fs.rename(filePath, './public/uploads/' +
                            imageName + ext,
                            function(err, file) {
                                if (err) {

                                    console.log(err);
                                }
                            });

                        var newImage = new Image({
                            title: req.body.title,
                            filename: imageName + ext,
                            description: req.body.description,
                            user: req.session.passport.user



                        }).save();
                    } else {
                        fs.unlink(filePath, function() {
                            console.log('file removed');

                        });

                        req.flash('error', 'Not a valid file extension');
                        console.log(res.error);
                        return res.redirect('/');
                    }
                }
                res.redirect('/image/' + imageName);
            });


        }

        if (req.body.title && req.body.description && req.files[0]) {
            storeImage();
        } else {
            req.flash('error', 'Fill in all fields');
            return res.redirect('/');
        }



    },

    deleteImage: function(req, res) {
        Image.findOne({
            filename: {
                $regex: req.params.idImage
            }
        }, function(err, image) {
            if(err) {
                return next(err);
            } if(image) {
                Comment.remove({image_id: image._id}, function(err, info) {
                    if(err) {
                        return next(err);
                    }

                    Image.remove({_id: image._id}, function(err, inf) {
                        if(err) {
                            return next(err);
                        }
                        res.redirect("/");
                    })
                })
            } else {
                return res.render("/");
            }



        })
    },


        showImage: function(req, res) {
        Image.findOne({
                filename: {
                    $regex: req.params.idImage
                }
            })
            .populate('comments').exec(function(err, image) {

                var view = {
                    image: image
                };



                User.findById(req.session.passport.user, function(err, user) {




                    view.gravatarImg = user.gravatarImg;
                    view.currentUser = req.session.passport.user;

                    sidebar.sidebar(view, function() {

                        res.render('showImage', view);
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
                error: 'Invalid value'
            });
        } else {
            Image.findOne({
                    filename: {
                        $regex: req.params.idImage
                    }
                },
                function(err, image) {
                    Comment.create({
                        text: cleanData,
                    }, function(err, comment) {
                        if (err) {
                            console.log(err);
                        } else {
                            User.findById(req.session.passport.user, function(err, user) {

                                comment.image_id = image._id;
                                comment.gravatarImg = user.gravatarImg;
                                comment.username = user.username;
                                comment.save();
                                image.comments.unshift(comment);
                                image.save();
                                res.json({
                                    data: cleanData,
                                    username: comment.username
                                });
                            })
                        }
                    });

                });
        }

    },

    like: function(req, res) {
        var countlikes;
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


                        console.log(image.likes);
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
