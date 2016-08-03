var express = require('express');
var app = express();
var config = require("./configure/configure");
var indexRoutes = require("./routes/index");

app = config();


app.use("/", indexRoutes);

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});