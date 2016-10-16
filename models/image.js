var mongoose = require("mongoose");
var path = require("path");

var Image = new mongoose.Schema({
    title: String,
    filename: String,
    description: String,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    likes: {
        type: Number,
        "default": 0
    },
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment"
    }],
    date: Date
});

Image.virtual("linkId").get(function() {
    return this.filename.replace(path.extname(this.filename), "");
});

module.exports = mongoose.model("Image", Image);
