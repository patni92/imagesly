var multer = require('multer');
var path = require("path");
var Image = require("../models/image");
var Comment = require("../models/comment");


var middlewareObj = {};

middlewareObj.uploadFile = function(req, res, next) {
    var storage = multer.diskStorage({
        destination: function(req, file, cb) {
            cb(null, './public/uploads');
        }

    });
    var upload = multer({
        storage: storage,
        limits: {
            fileSize: 5242880
        }
    }).any();

    upload(req, res, function(err) {
        if (err) return next(err)

        next();
    })
}


middlewareObj.isAuthenticated = function(req, res, next) {

    var view = {};

    view.layout = "empty";


    if (req.isAuthenticated())
        return next();
    res.render("login", view);
}


middlewareObj.checkImageOwnership = function(req, res, next) {

    if (req.isAuthenticated()) {

        console.log(req.session.passport.user);

        Image.findOne({
            filename: {
                $regex: req.params.idImage
            }
        }, function(err, image) {
            if (err) {
                req.flash("Image not found");
                res.redirect("/");
            } else {
                console.log(image);
                if (image.user.equals(req.session.passport.user)) {
                    next();
                } else {
                    req.flash("error","You don't have permission to do that")
                    res.redirect("/");
                }

            }
        });


    } else {
        req.flash("error", "You need to be logged in to do that")
        res.redirect("back");
    }


}


middlewareObj.checkCommentOwnership = function(req, res, next) {

    if (req.isAuthenticated()) {

 console.log(req.session);
        Comment.findOne({
            user_id: req.session.passport.user
        }, function(err, comment) {
            if (err) {
                req.flash("error","comment not found");
                res.redirect("/");
            } else {
                console.log(comment);
                if (comment.user_id.equals(req.session.passport.user)) {
                    next();
                } else {
                    req.flash("error", "You don't have permission to do that")
                    res.redirect("/");
                }

            }
        });


    } else {
        req.flash("error", "You need to be logged in to do that")
        res.redirect("back");
    }


}


module.exports = middlewareObj;
