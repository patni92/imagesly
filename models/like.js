var mongoose = require("mongoose");
var Like = new mongoose.Schema({
    image: {type: mongoose.Schema.Types.ObjectId, ref: "Image"},
    user: {type: mongoose.Schema.Types.ObjectId, ref: "User"}
});
module.exports = mongoose.model("Like", Like);
