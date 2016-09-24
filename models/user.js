var mongoose = require("mongoose");
require("mongoose-type-email");
var bcrypt = require("bcrypt");
var  SALT_WORK_FACTOR = 10;
var gravatar = require("gravatar");

var UserSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: { type: mongoose.SchemaTypes.Email, required: true,  unique: true},
    password: { type: String, required: true },
    gravatarImg: String
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

UserSchema.pre("save", function(next) {
    var user = this;
    user.gravatarImg = gravatar.url(user.email);
    if (user.isModified("password")) {
        bcrypt.hash(user.password, SALT_WORK_FACTOR, function(err, hash) {

            if (err) {
                return next(err);
            }

            user.password = hash;
            next();
        });
    }
});

var User = mongoose.model("User", UserSchema);

module.exports = User;
