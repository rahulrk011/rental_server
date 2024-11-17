const mongoose = require('mongoose');
const Product = require('./Product');

// Rent Schema
const rentSchema = new mongoose.Schema({
  sellerEmail: {
    type: String,
    required: true
  },
  buyerEmail: {
    type: String,
    required: true
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  costTillNow: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['Ongoing', 'Settled', 'Requested', 'Cancelled'],
    default: 'Requested'
  },
}, {
  timestamps: true // Automatically adds createdAt and updatedAt fields
});

const Rent = mongoose.model('Rent', rentSchema);

module.exports = Rent;
