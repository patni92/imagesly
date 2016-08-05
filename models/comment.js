var mongoose = require("mongoose");
var path = require("path");
var Comment = new mongoose.Schema({
    text: String,
    title: String,
    body: String,
    date: Date,
});



module.exports = mongoose.model("Comment", Comment);
