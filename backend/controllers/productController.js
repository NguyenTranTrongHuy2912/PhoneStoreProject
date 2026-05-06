const Product = require('../models/Product');

// @desc    Lấy danh sách tất cả sản phẩm (có hỗ trợ lọc theo thương hiệu nếu cần)
// @route   GET /api/products
exports.getProducts = async (req, res) => {
    try {
        const { brand } = req.query;
        let query = {};

        // Nếu người dùng chọn lọc theo thương hiệu (ví dụ: Apple, Samsung)
        if (brand) {
            query.brand = brand;
        }

        const products = await Product.find(query);
        
        res.status(200).json({
            success: true,
            count: products.length,
            data: products
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Lỗi không thể lấy danh sách sản phẩm",
            error: error.message
        });
    }
};

// @desc    Lấy chi tiết một sản phẩm theo ID
// @route   GET /api/products/:id
exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy sản phẩm này"
            });
        }

        res.status(200).json({
            success: true,
            data: product
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Lỗi định dạng ID hoặc lỗi server",
            error: error.message
        });
    }
};

// @desc    Tìm kiếm sản phẩm theo tên (Dành cho thanh Search của Huy)
// @route   GET /api/products/search/:keyword
exports.searchProducts = async (req, res) => {
    try {
        const keyword = req.params.keyword;
        const products = await Product.find({
            name: { $regex: keyword, $options: 'i' } // 'i' là không phân biệt chữ hoa chữ thường
        });

        res.status(200).json({
            success: true,
            count: products.length,
            data: products
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Lỗi khi tìm kiếm sản phẩm",
            error: error.message
        });
    }
};