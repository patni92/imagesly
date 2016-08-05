var mongoose = require("mongoose");

var ImageSchema = new mongoose.Schema({
   title: String,
   filename: String,
   description: String,
   likes: { type: Number, "default": 0 },

});

module.exports = mongoose.model("Image", ImageSchema);