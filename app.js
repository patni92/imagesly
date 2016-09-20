var express = require('express');
var config = require("./configure/configure");
var app = express();
var mongoose = require("mongoose");


app.set("port", process.env.PORT || 3000);



app = config(app);

app.use(function(err, req, res, next) {
  console.error(err);
  res.status(500).send(err.message);
});

mongoose.connect('mongodb://localhost/imagesly');
mongoose.connection.on('open', function () { console.log('Mongoose connected.'); });




app.listen(app.get("port"), function () {
    console.log("Example app at http://localhost:" + app.get("port"));
});
