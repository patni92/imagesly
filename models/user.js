var mongoose = require("mongoose");
require("mongoose-type-email");
var  SALT_WORK_FACTOR = 10;
var gravatar = require("gravatar");
var findOrCreate = require('mongoose-findorcreate');

var UserSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    username: { type: String,   unique: true},
    email: { type: mongoose.SchemaTypes.Email,  unique: true},
    password: { type: String },
    gravatarImg:  { type: String, default: "" },
    fb: {
		id: String,
		access_token: String,
		firstName: String,
		lastName: String,
		email: String,
        token: String,
        username: String
	}
});




UserSchema.statics.authenticate = function(email, password, callback) {
    User.findOne({email: email}, function(err, user) {
        if (err) {
            return callback(err);
        } else if (!user) {
            var error = new Error("User not found");
            return callback(error);
        }
        bcrypt.compare(password, user.password, function(error, result) {
            if (result === true) {
                callback(null, user);
            } else {
                callback();
            }
        });
    });
}



var User = mongoose.model("User", UserSchema);

module.exports = User;
