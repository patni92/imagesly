var bodyparser = require("body-parser");
var express = require("express");
var exphbs = require("express-handlebars");
var path = require("path");
var routes = require("../routes/routes");
var methodOverride = require("method-override");
var moment = require("moment");
var passport = require("passport");
var expressSession = require("express-session");
var config = require("../config.json");
var flash = require("connect-flash");
var MongoStore = require("connect-mongo")(expressSession);
var mongoose = require("mongoose");

require("./passport")(passport);

module.exports = function(app) {

    app.set("port", process.env.PORT || 3000);
    mongoose.connect("mongodb://localhost/imagesly");
    mongoose.connection.on("open", function() {
        console.log("Mongoose connected.");
    });

    app.use(expressSession({
        secret: config.sessionSecret,
        resave: true,
        saveUninitialized: true,
        store: new MongoStore({
            mongooseConnection: mongoose.connection,
            ttl: 120 * 60
        })
    }));

    app.use(passport.initialize());
    app.use(passport.session());
    app.use(flash());
    app.use(function(req, res, next) {
        res.locals.message = req.flash("login-err");
        res.locals.success = req.flash("success");
        res.locals.error = req.flash("error");
        next();
    });

    app.use(bodyparser.urlencoded({
        "extended": true
    }));
    app.use(bodyparser.json());
    app.use(methodOverride("_method"));

    app.use(express.static(path.join(__dirname, "../public")));

    routes(app, passport);

    app.use(function(err, req, res, next) {

        if (err.message === "File too large") {
            req.flash("error", "Image is to big, can be up to 5 Megabyte");
            return res.redirect("/");
        }

        res.status(500).send("Something broke!");
    });

    app.use(function(req, res) {
        var view = {};
        view.layout = "empty";
        res.render("404page", view);
    });

    app.engine("handlebars", exphbs.create({
        layoutsDir: app.get("views") + "/layouts",
        defaultLayout: "main",
        partialsDir: app.get("views") + "/partials",
        helpers: {
            timeago: function(timestamp) {
                return moment(timestamp).startOf("minute").fromNow();
            },

            isOwnerImage: function(object) {
                return object.image.user.toString() === object.currentUser.toString();
            },

            isOwnerComment: function(object, currentUser) {
                return object.user_id.toString() === currentUser.toString();
            }
        }

    }).engine);

    app.set("view engine", "handlebars");

    return app;
};
