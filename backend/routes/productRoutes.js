const express = require('express');
const router = express.Router();

// Import các hàm xử lý từ controllers
const { 
    getProducts, 
    getProductById, 
    searchProducts,
    createProduct,
    updateProduct,
    deleteProduct
} = require('../controllers/productController');

// Import middleware
const { protect } = require('../middleware/auth');
const { adminCheck } = require('../middleware/adminCheck');
const { validateProduct } = require('../middleware/validation');

// 1. Route lấy danh sách tất cả sản phẩm (hoặc lọc theo brand qua query)
// URL: GET http://localhost:5000/api/products
// Ví dụ lọc: GET http://localhost:5000/api/products?brand=Apple
router.get('/', getProducts);

// 2. Route tìm kiếm sản phẩm theo từ khóa tên máy
// URL: GET http://localhost:5000/api/products/search/:keyword
// Ví dụ: GET http://localhost:5000/api/products/search/iPhone
// ⚠️ PHẢI đặt trước route :id để tránh conflict
router.get('/search/:keyword', searchProducts);

// 3. Route tạo sản phẩm mới (Admin Only)
// URL: POST http://localhost:5000/api/products
// Headers: Authorization: Bearer <token>
router.post('/', protect, adminCheck, validateProduct, createProduct);

// 4. Route cập nhật sản phẩm (Admin Only)
// URL: PUT http://localhost:5000/api/products/:id
// Headers: Authorization: Bearer <token>
router.put('/:id', protect, adminCheck, validateProduct, updateProduct);

// 5. Route xóa sản phẩm (Admin Only)
// URL: DELETE http://localhost:5000/api/products/:id
// Headers: Authorization: Bearer <token>
router.delete('/:id', protect, adminCheck, deleteProduct);

// 6. Route lấy chi tiết một sản phẩm theo ID
// URL: GET http://localhost:5000/api/products/:id
// Ví dụ: GET http://localhost:5000/api/products/69df3326b4059e47b54d7947
// ⚠️ PHẢI đặt cuối cùng để không conflict với routes khác
router.get('/:id', getProductById);

module.exports = router;