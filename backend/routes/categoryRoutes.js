const express = require('express');
const router = express.Router();
const { 
    getCategories, 
    createCategory, 
    getCategoryById 
} = require('../controllers/categoryController');

// Import middleware
const { protect } = require('../middleware/auth');
const { adminCheck } = require('../middleware/adminCheck');

// URL: GET & POST http://localhost:5000/api/categories
// GET: Public
// POST: Admin Only
router.route('/')
    .get(getCategories)
    .post(protect, adminCheck, createCategory);

// URL: GET http://localhost:5000/api/categories/:id
// Public
router.get('/:id', getCategoryById);

module.exports = router;