var bodyparser = require("body-parser");
var express = require("express");
var exphbs = require('express-handlebars');
var path = require("path");
var routes = require("../routes/routes");
var methodOverride = require("method-override");
var errorHandler = require("errorHandler");
var multer = require("multer");
var moment = require("moment");
var passport = require('passport');
var expressSession = require('express-session');
var config = require("../config.json");
var flash = require("connect-flash");

require('./passport')(passport);

module.exports = function(app) {

    app.use(expressSession({
        secret: config.sessionSecret,
        resave: false,
        saveUninitialized: false,
    }));


    app.use(passport.initialize());
    app.use(passport.session());
    app.use(flash());
    app.use(function(req, res, next) {
        res.locals.success = req.flash('success');
        res.locals.error = req.flash('error');
        next();
    });



    app.use(bodyparser.urlencoded({
        "extended": true
    }));
    app.use(bodyparser.json());
    app.use(methodOverride());



    app.use(express.static(path.join(__dirname, "../public")));



    routes(app, passport);

    app.use(function(err, req, res, next) {
        if(err.message === "File too large") {
            req.flash('error', 'Image is to big, can be up to 5 Megabyte');
            return res.redirect('/');
        }
        console.error(err.message);
        res.status(500).send('Something broke!');
    });



    app.engine('handlebars', exphbs.create({
        layoutsDir: app.get("views") + "/layouts",
        defaultLayout: "main",
        partialsDir: app.get("views") + "/partials",
        helpers: {
            timeago: function(timestamp) {
                return moment(timestamp).startOf("minute").fromNow();
            }
        }

    }).engine);

    app.set('view engine', 'handlebars');

    return app;
};
