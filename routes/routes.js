var express = require("express");
var router = express.Router();
var home = require("../controllers/home");
var image = require("../controllers/image");
var auth = require("../controllers/auth");
var upload = require("../middleware/upload").upload;

var isAuthenticated = function(req, res, next) {

    var view = {};

    view.layout = "empty";
    view.error = req.flash('error');
    view.message = req.flash("message");

    if (req.isAuthenticated())
        return next();
    res.render("login", view);
}

module.exports = function(app, passport) {
    app.use(router);
    router.get("/", isAuthenticated, home.index);
    router.post("/", upload, image.newImage);
    router.post("/register", auth.register);
    router.post("/login", passport.authenticate("local-login", {
        successRedirect: '/',
        failureRedirect: '/',
        failureFlash: true
    }));
    router.post("/logout", auth.logout);

    router.get('/auth/facebook', passport.authenticate('facebook', { scope: 'email' }));
    router.get('/auth/facebook/callback', passport.authenticate('facebook', {
  successRedirect: '/',
  failureRedirect: '/',
}));


    router.get("/image/:idImage", image.showImage);
    router.post("/image/:idImage/comment", image.newComment);
    router.post("/image/:idImage/like", image.like);

};
