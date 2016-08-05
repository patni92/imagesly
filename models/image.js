var mongoose = require("mongoose");
var path = require("path");
var Comment = require("./comment")
var Image = new mongoose.Schema({
   title: String,
   filename: String,
   description: String,
   likes: { type: Number, "default": 0 },
   comments  : [Comment],
   date: Date,

});

Image.virtual('linkId').get(function() {
    return this.filename.replace(path.extname(this.filename), "");
});

module.exports = mongoose.model("Image", Image);