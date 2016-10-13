var multer = require('multer');
var path = require("path");
var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './public/uploads');
    }

});
var upload = multer({
    storage: storage,
    limits: {
        fileSize: 5242880
    }
}).any();

module.exports.upload = function (req, res, next) {
  upload(req, res, function (err) {
    if (err) return next(err)

    next();
  })
}
