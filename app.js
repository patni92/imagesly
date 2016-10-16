var express = require('express');
var config = require("./configure/configure");
var app = express();
var mongoose = require("mongoose");






app = config(app);









app.listen(app.get("port"), function () {
    console.log("Example app at http://localhost:" + app.get("port"));
});
