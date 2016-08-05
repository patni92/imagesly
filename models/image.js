var mongoose = require("mongoose");
var path = require("path");
var ImageSchema = new mongoose.Schema({
   title: String,
   filename: String,
   description: String,
   likes: { type: Number, "default": 0 },


});

ImageSchema.virtual('linkId').get(function() {
    return this.filename.replace(path.extname(this.filename), "");
});

module.exports = mongoose.model("Image", ImageSchema);