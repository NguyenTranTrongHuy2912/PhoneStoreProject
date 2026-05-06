const express = require('express');
const router = express.Router();

// Import các hàm xử lý từ controllers
// Đảm bảo đường dẫn chính xác tới thư mục 'controllers' (có chữ s)
const { 
    getProducts, 
    getProductById, 
    searchProducts 
} = require('../controllers/productController');

// 1. Route lấy danh sách tất cả sản phẩm (hoặc lọc theo brand qua query)
// URL: GET http://localhost:5000/api/products
// Ví dụ lọc: GET http://localhost:5000/api/products?brand=Apple
router.get('/', getProducts);

// 2. Route tìm kiếm sản phẩm theo từ khóa tên máy
// URL: GET http://localhost:5000/api/products/search/:keyword
// Ví dụ: GET http://localhost:5000/api/products/search/iPhone
router.get('/search/:keyword', searchProducts);

// 3. Route lấy chi tiết một sản phẩm theo ID
// URL: GET http://localhost:5000/api/products/:id
// Ví dụ: GET http://localhost:5000/api/products/69df3326b4059e47b54d7947
router.get('/:id', getProductById);

module.exports = router;