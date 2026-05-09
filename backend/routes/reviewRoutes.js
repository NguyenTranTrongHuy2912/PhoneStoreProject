const express = require('express');
const router = express.Router();
const { 
    createReview, 
    getProductReviews, 
    deleteReview 
} = require('../controllers/reviewController');

// Import middleware
const { protect } = require('../middleware/auth');
const { adminCheck } = require('../middleware/adminCheck');
const { validateReview } = require('../middleware/validation');

// URL: POST http://localhost:5000/api/reviews (Gửi đánh giá)
// Require: JWT Token
router.post('/', protect, validateReview, createReview);

// URL: GET http://localhost:5000/api/reviews/product/:productId (Lấy đánh giá theo sản phẩm)
// Public: không cần token
router.get('/product/:productId', getProductReviews);

// URL: DELETE http://localhost:5000/api/reviews/:id (Xóa đánh giá)
// Require: JWT Token (admin or review owner)
router.delete('/:id', protect, deleteReview);

module.exports = router;