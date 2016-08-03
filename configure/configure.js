var express = require("express");
var app = express();
var exphbs  = require('express-handlebars');
var path = require("path");

module.exports = function () {

  app.use(express.static(path.join(__dirname, "../public")));

  app.engine('handlebars', exphbs.create({
     layoutsDir: app.get("views") + "/layouts",
     defaultLayout: "main",
     partialsDir: app.get("views") + "/partials",

  }).engine);
  
  app.set('view engine', 'handlebars');

  return app;
};
