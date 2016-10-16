var mongoose = require("mongoose");
require("mongoose-type-email");

var UserSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    username: {
        type: String,
        unique: true
    },
    email: {
        type: mongoose.SchemaTypes.Email,
        unique: true
    },
    password: {
        type: String
    },
    gravatarImg: {
        type: String,
        default: ""
    },
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

var User = mongoose.model("User", UserSchema);

UserSchema.statics.authenticate = function(email, password, callback) {
    User.findOne({
        email: email
    }, function(err, user) {

        if (err) {
            return callback(err);

        } else if (!user) {
            var error = new Error("User not found");
            return callback(error);
        }

    });
};

module.exports = User;
