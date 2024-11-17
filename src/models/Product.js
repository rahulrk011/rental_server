const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  pricePerDay: { type: Number, required: true },
  contactNumber: { type: String, required: true },
  region: { type: String, required: true },
  address: { type: String, required: true },
  photo: { type: String },
  email: {
    type: String,
    required: true
  },
  description:{
    type: String,
    required:true,
  }
},
{timestamps: true});

productSchema.index({ name: 'text', category: 'text', region: 'text' });

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
