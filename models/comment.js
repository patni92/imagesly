var mongoose = require("mongoose");
var path = require("path");
var Comment = new mongoose.Schema({
    text: String,
    timestamp: { type: Date, "default": Date.now }
});



module.exports = mongoose.model("Comment", Comment);
