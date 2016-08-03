var express = require("express");
var router = express.Router();

router.get('/', function(req, res, next) {
  res.send("testing index, hello world!");
});


module.exports = router;
