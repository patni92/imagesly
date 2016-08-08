var mongoose = require("mongoose");
var path = require("path");
var Comment = new mongoose.Schema({
    text: String,
    timestamp: { type: Date, "default": Date.now },
    image_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Image"
    },
});



module.exports = mongoose.model("Comment", Comment);
