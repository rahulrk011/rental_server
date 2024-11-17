const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const multer = require('multer');
const path = require('path');

// Multer setup for handling photo uploads
const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

// POST route for creating a new product
router.post('/add', upload.single('photo'), async (req, res) => {
  try {
    const { name, category, pricePerDay, contactNumber, region, address, email , description } = req.body;

    console.log(req.file); // To check if the photo was received

    // Create and save new product
    const photo = req.file ? req.file.path.replace(/\\/g, '/') : null;
    const newProduct = new Product({
      name,
      category,
      pricePerDay,
      contactNumber,
      region,
      address,
      photo,
      email,
      description
    });

    await newProduct.save(); // Save to MongoDB
    res.status(201).json({ message: 'Product posted successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/', async (req, res) => {
  const { category,email } = req.query;
  try {
    const filter = category && category !== 'All' ? { category } : {};
    filter.email={$ne:email};
    const products = await Product.find(filter).sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});


module.exports = router;
