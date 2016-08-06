var express = require("express");
var router = express.Router();
var home = require("../controllers/home");
var image = require("../controllers/image");




module.exports = function(app) {
    app.use(router);
    router.get("/", home.index);
    router.post("/", image.newImage);
    router.get("/image/:idImage", image.showImage);
    router.post("/image/:idImage/comment", image.newComment);
    
   


};
