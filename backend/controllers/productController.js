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

        const products = await Product.find(query).populate('category', 'name slug');
        
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
        const product = await Product.findById(req.params.id).populate('category', 'name slug');

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
        }).populate('category', 'name slug');

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

// @desc    Tạo sản phẩm mới (Admin Only)
// @route   POST /api/products
exports.createProduct = async (req, res) => {
    try {
        const { name, brand, category, description, specifications, variants, images } = req.body;

        const product = await Product.create({
            name,
            brand,
            category,
            description,
            specifications,
            variants,
            images
        });

        const populatedProduct = await product.populate('category', 'name slug');

        res.status(201).json({
            success: true,
            message: 'Sản phẩm đã được tạo thành công',
            data: populatedProduct
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: "Không thể tạo sản phẩm",
            error: error.message
        });
    }
};

// @desc    Cập nhật sản phẩm (Admin Only)
// @route   PUT /api/products/:id
exports.updateProduct = async (req, res) => {
    try {
        const { name, brand, category, description, specifications, variants, images } = req.body;

        let product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Sản phẩm không tồn tại"
            });
        }

        // Cập nhật các field
        product.name = name || product.name;
        product.brand = brand || product.brand;
        product.category = category || product.category;
        product.description = description || product.description;
        product.specifications = specifications || product.specifications;
        product.variants = variants || product.variants;
        product.images = images || product.images;

        product = await product.save();
        const populatedProduct = await product.populate('category', 'name slug');

        res.status(200).json({
            success: true,
            message: 'Sản phẩm đã được cập nhật',
            data: populatedProduct
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: "Không thể cập nhật sản phẩm",
            error: error.message
        });
    }
};

// @desc    Xóa sản phẩm (Admin Only)
// @route   DELETE /api/products/:id
exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Sản phẩm không tồn tại"
            });
        }

        await product.deleteOne();

        res.status(200).json({
            success: true,
            message: "Sản phẩm đã được xóa thành công"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Không thể xóa sản phẩm",
            error: error.message
        });
    }
};