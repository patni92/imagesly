var express = require("express");
var router = express.Router();
var home = require("../controllers/home");
var image = require("../controllers/image");
var auth = require("../controllers/auth")

module.exports = function(app) {
    app.use(router);
    router.get("/", home.index);
    router.post("/", image.newImage);
    router.post("/register", auth.register);
    router.post("/login", auth.login);
    router.get("/image/:idImage", image.showImage);
    router.post("/image/:idImage/comment", image.newComment);
    router.post("/image/:idImage/like", image.like);

};
