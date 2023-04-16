const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  desc: {
    type: String,
    required: true
  },
  img: {
    type: String,
  },
  categories: {
    type: String,
    enum: ['Aliments', 'Accessoires', 'Jouets'],
    required: true
  },
  price: {
    type: Number,
    required: true
  }
});
const Product = mongoose.model('Product', productSchema);

module.exports = Product;
