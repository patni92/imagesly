var bodyparser = require("body-parser");
var express = require("express");
var exphbs = require('express-handlebars');
var path = require("path");
var routes = require("../routes/routes");
var methodOverride = require("method-override");
var errorHandler = require("errorHandler");
var multer = require("multer");
var moment = require("moment");






module.exports = function(app) {

    app.use(bodyparser.urlencoded({ "extended": true }));
    app.use(bodyparser.json());
    app.use(methodOverride());


    app.use(express.static(path.join(__dirname, "../public")));


    var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/uploads');
    },
   
});

    app.use(multer({ storage: storage }).any());



    if ("development" === app.get("env")) {
        app.use(errorHandler());
    }

    routes(app);

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
