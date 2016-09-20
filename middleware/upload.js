var multer = require('multer');
var path = require("path");
module.exports = {
    upload: function(req, res, next) {

       multer({ dest: path.join(__dirname, 'public/upload/temp') }).any();
       next();
    }

    
};
