const express = require('express');
const router = express.Router();
const { 
    registerUser, 
    loginUser, 
    getUserProfile 
} = require('../controllers/userController');

// Route Đăng ký: POST http://localhost:5000/api/users/register
router.post('/register', registerUser);

// Route Đăng nhập: POST http://localhost:5000/api/users/login
router.post('/login', loginUser);

// Route Profile: GET http://localhost:5000/api/users/profile/:id
router.get('/profile/:id', getUserProfile);

module.exports = router;