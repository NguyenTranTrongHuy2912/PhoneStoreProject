const express = require('express');
const router = express.Router();
const { 
    createReview, 
    getProductReviews, 
    deleteReview 
} = require('../controllers/reviewController');

// URL: POST http://localhost:5000/api/reviews (Gửi đánh giá)
router.post('/', createReview);

// URL: GET http://localhost:5000/api/reviews/product/:productId (Lấy đánh giá theo sản phẩm)
router.get('/product/:productId', getProductReviews);

// URL: DELETE http://localhost:5000/api/reviews/:id (Xóa đánh giá)
router.delete('/:id', deleteReview);

module.exports = router;