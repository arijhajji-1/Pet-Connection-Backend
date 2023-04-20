const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true
  },
  valeur: {
    type: Number,
    required: true
  }
});
const Coupon = mongoose.model('Coupon', couponSchema);

module.exports = Coupon;
