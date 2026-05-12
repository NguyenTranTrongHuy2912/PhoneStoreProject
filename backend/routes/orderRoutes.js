const express = require('express');
const router = express.Router();
const { 
    createOrder, 
    getAllOrders,
    getUserOrders, 
    getOrderById, 
    updateOrderStatus 
} = require('../controllers/orderController');

// Import middleware
const { protect } = require('../middleware/auth');
const { adminCheck } = require('../middleware/adminCheck');
const { validateOrder } = require('../middleware/validation');

// URL: POST http://localhost:5000/api/orders (Tạo đơn hàng)
// Require: JWT Token
router.post('/', protect, validateOrder, createOrder);

// URL: GET http://localhost:5000/api/orders (Admin xem tất cả đơn hàng)
// Require: JWT Token + Admin role
router.get('/', protect, adminCheck, getAllOrders);

// URL: GET http://localhost:5000/api/orders/user/:userId (Lịch sử mua của 1 người)
// Require: JWT Token
// ⚠️ Phải đặt trước /:id để tránh conflict
router.get('/user/:userId', protect, getUserOrders);

// URL: GET http://localhost:5000/api/orders/:id (Xem chi tiết 1 đơn)
// Require: JWT Token
router.get('/:id', protect, getOrderById);

// URL: PUT http://localhost:5000/api/orders/:id/status (Cập nhật trạng thái - Admin)
// Require: JWT Token + Admin role
router.put('/:id/status', protect, adminCheck, updateOrderStatus);

module.exports = router;