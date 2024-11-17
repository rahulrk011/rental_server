    const express = require('express');
    const mongoose = require('mongoose');
    const cors = require('cors');
    const authRoutes = require('./src/routes/authRoutes');
    const productRoutes = require('./src/routes/productRoutes'); 
    const path = require('path'); 
    require('dotenv').config();
    const db = require('./src/config/db');

    const app = express();
    const PORT = process.env.PORT || 5000;

    // Middleware
    app.use(cors()); // Enable CORS
    app.use(express.json()); // Parse JSON data

    // Static file serving for uploaded product images
    app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

    // MongoDB Connection
    db(); // Connect to MongoDB

    // Routes
    app.use('/api/auth', authRoutes); // Authentication routes
    app.use('/api/products', productRoutes); // Product-related routes

    // Start the server
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
