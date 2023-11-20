var mongoose = require('mongoose');

var GallerySchema = new mongoose.Schema({
  id: String,
  imageUrl: String,
  uploaded: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Gallery', GallerySchema);