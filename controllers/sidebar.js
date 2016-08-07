var Image = require("../models/image");
module.exports = {
  sidebar: function(view, callback) {
    
    Image.find().sort({likes: -1}).limit(6).exec(function (err, images) {
      
      view.popularImages = images;

      console.log(view);

      callback();
    });
  }
};