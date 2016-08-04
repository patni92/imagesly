var mongoose = require("mongoose");

var campgroundSchema = new mongoose.Schema({
   title: String,
   filename: String,
   description: String,
   likes: Number,

});

module.exports = mongoose.model("Campground", campgroundSchema);