const express = require('express');
const router = express.Router();
const { createPaymentUrl, paymentCallback, confirmOrder } = require('../controllers/vnpayController');
const { protect } = require('../middleware/auth');

// POST /api/vnpay/create-payment-url
// Tạo URL thanh toán VNPay (cần đăng nhập)
router.post('/create-payment-url', protect, createPaymentUrl);

// GET /api/vnpay/callback
// VNPay redirect về URL này sau khi thanh toán (không cần auth - VNPay gọi)
router.get('/callback', paymentCallback);

// POST /api/vnpay/confirm-order
// Frontend xác nhận đặt hàng sau khi thanh toán VNPay thành công
router.post('/confirm-order', protect, confirmOrder);

module.exports = router;
