const express = require('express');
const router = express.Router();
const { 
    registerUser, 
    loginUser, 
    getUserProfile,
    updateUserProfile,
    getAllUsers,
    updateUserRole,
    deleteUser,
    forgotPassword,
    resetPassword
} = require('../controllers/userController');

// Import middleware
const { protect } = require('../middleware/auth');
const { adminCheck } = require('../middleware/adminCheck');
const { validateRegister, validateLogin, validateProfile } = require('../middleware/validation');

// Route Đăng ký: POST http://localhost:5000/api/users/register
// Validation: validateRegister (kiểm tra email, password, phone)
router.post('/register', validateRegister, registerUser);

// Route Đăng nhập: POST http://localhost:5000/api/users/login
// Validation: validateLogin (kiểm tra email, password)
router.post('/login', validateLogin, loginUser);

// Route Quên mật khẩu: POST http://localhost:5000/api/users/forgot-password
router.post('/forgot-password', forgotPassword);

// Route Đặt lại mật khẩu: POST http://localhost:5000/api/users/reset-password
router.post('/reset-password', resetPassword);

// Route Profile: GET http://localhost:5000/api/users/profile/:id
// Require: JWT Token trong header "Authorization: Bearer <token>"
router.get('/profile/:id', protect, getUserProfile);

// Route Get All Users: GET http://localhost:5000/api/users
// Require: JWT Token + Admin role
router.get('/', protect, adminCheck, getAllUsers);

// Route Update Profile: PUT http://localhost:5000/api/users/:id
// Require: JWT Token trong header "Authorization: Bearer <token>"
router.put('/:id', protect, validateProfile, updateUserProfile);

// Route Update User Role: PUT http://localhost:5000/api/users/:id/role
// Require: JWT Token + Admin role
router.put('/:id/role', protect, adminCheck, updateUserRole);

// Route Delete User: DELETE http://localhost:5000/api/users/:id
// Require: JWT Token + Admin role
router.delete('/:id', protect, adminCheck, deleteUser);

module.exports = router;