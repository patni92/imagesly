var express = require('express');
var app = express();
var indexRoutes = require("./routes/index");

app.use("/", indexRoutes);

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});