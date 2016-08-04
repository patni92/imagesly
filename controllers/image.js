var fs = require("fs");  
var path = require("path");  
var uid = require("uid2");  
var mime = require("mime");  

module.exports = {
  newImage: function(req, res) {
    console.log(req.body);
    res.redirect("/");
  }
};