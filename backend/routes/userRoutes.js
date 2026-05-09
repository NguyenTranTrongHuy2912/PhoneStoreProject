const express = require('express');
const router = express.Router();
const { 
    registerUser, 
    loginUser, 
    getUserProfile 
} = require('../controllers/userController');

// Import middleware
const { protect } = require('../middleware/auth');
const { validateRegister, validateLogin } = require('../middleware/validation');

// Route Đăng ký: POST http://localhost:5000/api/users/register
// Validation: validateRegister (kiểm tra email, password, phone)
router.post('/register', validateRegister, registerUser);

// Route Đăng nhập: POST http://localhost:5000/api/users/login
// Validation: validateLogin (kiểm tra email, password)
router.post('/login', validateLogin, loginUser);

// Route Profile: GET http://localhost:5000/api/users/profile/:id
// Require: JWT Token trong header "Authorization: Bearer <token>"
router.get('/profile/:id', protect, getUserProfile);

module.exports = router;