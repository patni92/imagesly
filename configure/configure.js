var express = require("express");
var app = express();
var exphbs  = require('express-handlebars');

module.exports = function () {
  app.engine('handlebars', exphbs.create({
     layoutsDir: app.get("views") + "/layouts",
     defaultLayout: "main",
  }).engine);
  
  app.set('view engine', 'handlebars');

  return app;
};
