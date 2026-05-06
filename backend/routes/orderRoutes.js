const express = require('express');
const router = express.Router();
const { 
    createOrder, 
    getUserOrders, 
    getOrderById, 
    updateOrderStatus 
} = require('../controllers/orderController');

// URL: POST http://localhost:5000/api/orders (Tạo đơn hàng)
router.post('/', createOrder);

// URL: GET http://localhost:5000/api/orders/:id (Xem chi tiết 1 đơn)
router.get('/:id', getOrderById);

// URL: GET http://localhost:5000/api/orders/user/:userId (Lịch sử mua của 1 người)
router.get('/user/:userId', getUserOrders);

// URL: PUT http://localhost:5000/api/orders/:id/status (Cập nhật trạng thái - Admin)
router.put('/:id/status', updateOrderStatus);

module.exports = router;