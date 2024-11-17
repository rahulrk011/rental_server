const express = require('express');
const router = express.Router();
const User = require('../models/User'); 
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const crypto = require('crypto'); 
const path = require('path');
require('dotenv').config();

const secretKey = process.env.JWT_SECRET || 'kadavuleyajitheyy';

// Multer file upload setup
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Specify your upload folder
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname); // Generate unique file name
    }
});

// File type validation for ID card photo
const fileFilter = (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (extname && mimetype) {
        return cb(null, true);
    } else {
        return cb(new Error('Only images (jpeg, jpg, png, gif) are allowed.'));
    }
};

const upload = multer({ 
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // Limit to 5MB
});

// Registration Route
router.post('/register', upload.single('idCardPhoto'), async (req, res) => {
    const { name, email, password, creditCardNumber } = req.body;

    if (!password) {
        return res.status(400).json({ success: false, message: 'Password is required.' });
    }

    // If file is uploaded, we get the file path
    const idCardPhoto = req.file ? req.file.path.replace(/\\/g, '/') : null;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'User already exists!' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            idCardPhoto,
            creditCardNumber: creditCardNumber, // Store credit card info securely if needed
        });

        await newUser.save();
        res.status(201).json({ success: true, message: 'User registered successfully!' });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ success: false, message: 'Server error!' });
    }
});


// Login Route
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!password) {
        return res.status(400).json({ success: false, message: 'Password is required.' });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ success: false, message: 'Invalid email or password!' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: 'Invalid email or password!' });
        }

        const token = jwt.sign({ id: user._id, email: user.email }, secretKey, { expiresIn: '1h' });
        console.log(URLSearchParams);
        res.status(200).json({
            success: true,
            message: 'Login successful!',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                idCardPhoto: user.idCardPhoto, // Add any other user properties you want to include
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ success: false, message: 'Server error!' });
    }
});

// Get seller details by email
router.post('/getSellerDetails', async (req, res) => {
    const { email } = req.body;

    try {
        // Find the user by email, fetching only the name and idCardPhoto
        const user = await User.findOne({ email }, 'name idCardPhoto');

        if (!user) {
            return res.status(404).json({ success: false, message: 'Seller not found!' });
        }

        // Send the seller's name and photo ID as the response
        res.status(200).json({
            success: true,
            sellerName: user.name,
            sellerPhoto: user.idCardPhoto,
        });
    } catch (error) {
        console.error('Error fetching seller details:', error);
        res.status(500).json({ success: false, message: 'Server error!' });
    }
});


module.exports = router;
