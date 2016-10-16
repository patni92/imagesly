var express = require("express");
var router = express.Router();
var home = require("../controllers/home");
var image = require("../controllers/image");
var auth = require("../controllers/auth");
var middleware = require("../middleware/middlewareObj");



module.exports = function(app, passport) {
    app.use(router);
    router.get("/", middleware.isAuthenticated, home.index);
    router.post("/", middleware.isAuthenticated, middleware.uploadFile, image.newImage);
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


    router.get("/image/:idImage", middleware.isAuthenticated, image.showImage);
    router.delete("/image/:idImage", middleware.isAuthenticated, middleware.checkImageOwnership, image.deleteImage);
    router.post("/image/:idImage/comment", middleware.isAuthenticated, image.newComment);
    router.delete("/image/:idImage/comment/:comment_id", middleware.isAuthenticated, middleware.checkCommentOwnership, image.deleteComment);
    router.post("/image/:idImage/like", middleware.isAuthenticated,  image.like);

};
