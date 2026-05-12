const Category = require('../models/Category');

// @desc    Lấy tất cả danh mục (có thể lồng nhau nếu cần)
// @route   GET /api/categories
exports.getCategories = async (req, res) => {
    try {
        const categories = await Category.find().populate('parent_id', 'name');
        
        res.status(200).json({
            success: true,
            count: categories.length,
            data: categories
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Lỗi không thể lấy danh mục",
            error: error.message
        });
    }
};

// @desc    Tạo danh mục mới
// @route   POST /api/categories
exports.createCategory = async (req, res) => {
    try {
        const { name, slug, parent_id } = req.body;

        // Tự tạo slug đơn giản nếu frontend không gửi (Ví dụ: "Điện thoại" -> "dien-thoai")
        const categorySlug = slug || name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');

        const category = await Category.create({
            name,
            slug: categorySlug,
            parent_id: parent_id || null
        });

        res.status(201).json({
            success: true,
            data: category
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: "Không thể tạo danh mục (có thể trùng slug)",
            error: error.message
        });
    }
};

// @desc    Lấy chi tiết 1 danh mục
// @route   GET /api/categories/:id
exports.getCategoryById = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) {
            return res.status(404).json({ success: false, message: "Không tìm thấy" });
        }
        res.status(200).json({ success: true, data: category });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// @desc    Cập nhật danh mục (Admin)
// @route   PUT /api/categories/:id
exports.updateCategory = async (req, res) => {
    try {
        const { name, slug, parent_id } = req.body;
        const category = await Category.findById(req.params.id);

        if (!category) {
            return res.status(404).json({ success: false, message: "Không tìm thấy" });
        }

        if (name !== undefined) category.name = name;
        if (slug !== undefined) {
            category.slug = slug || category.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
        }
        if (parent_id !== undefined) category.parent_id = parent_id || null;

        const updated = await category.save();

        res.status(200).json({ success: true, data: updated });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: "Không thể cập nhật danh mục",
            error: error.message
        });
    }
};

// @desc    Xóa danh mục (Admin)
// @route   DELETE /api/categories/:id
exports.deleteCategory = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) {
            return res.status(404).json({ success: false, message: "Không tìm thấy" });
        }

        await category.deleteOne();

        res.status(200).json({ success: true, message: "Đã xóa danh mục" });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};