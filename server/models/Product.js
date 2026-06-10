const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title:         { type: String, required: true, trim: true },
  description:   { type: String, required: true },
  price:         { type: Number, required: true, min: 0 },
  discountPrice: { type: Number, default: 0 },
  stock:         { type: Number, required: true, default: 0 },
  images:        [{ type: String }],             // Cloudinary URLs or local paths
  category:      { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  seller:        { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  brand:         { type: String, default: '' },
  tags:          [{ type: String }],
  specs:         { type: Map, of: String },      // e.g. { "Color": "Red", "Size": "XL" }
  rating:        { type: Number, default: 0 },
  numReviews:    { type: Number, default: 0 },
  isActive:      { type: Boolean, default: true },
}, {
  timestamps: true,
  toJSON: { getters: true },
  toObject: { getters: true },
});

// Text index for search
productSchema.index({ title: 'text', description: 'text', brand: 'text', tags: 'text' });

module.exports = mongoose.model('Product', productSchema);
