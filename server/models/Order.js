const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product:  { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  title:    String,
  image:    String,
  price:    Number,
  quantity: { type: Number, default: 1 },
});

const orderSchema = new mongoose.Schema({
  buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [orderItemSchema],
  totalPrice: { type: Number, required: true },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  shippingAddress: {
    street:  String,
    city:    String,
    state:   String,
    pincode: String,
    country: String
  },
  paymentMethod: { type: String, enum: ['COD', 'online'], default: 'COD' },
  isPaid:        { type: Boolean, default: false },
  paidAt:        Date,
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
