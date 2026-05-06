const express = require('express');
const router = express.Router();
const { 
    getCategories, 
    createCategory, 
    getCategoryById 
} = require('../controllers/categoryController');

// URL: GET & POST http://localhost:5000/api/categories
router.route('/')
    .get(getCategories)
    .post(createCategory);

// URL: GET http://localhost:5000/api/categories/:id
router.get('/:id', getCategoryById);

module.exports = router;