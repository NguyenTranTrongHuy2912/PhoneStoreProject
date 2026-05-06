const Review = require('../models/Review');

// @desc    Tạo đánh giá mới
// @route   POST /api/reviews
exports.createReview = async (req, res) => {
    try {
        const { productId, userId, rating, comment } = req.body;

        const review = await Review.create({
            productId,
            userId,
            rating,
            comment
        });

        res.status(201).json({
            success: true,
            message: "Cảm ơn bạn đã đánh giá sản phẩm!",
            data: review
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: "Không thể gửi đánh giá",
            error: error.message
        });
    }
};

// @desc    Lấy tất cả đánh giá của một sản phẩm cụ thể
// @route   GET /api/reviews/product/:productId
exports.getProductReviews = async (req, res) => {
    try {
        const reviews = await Review.find({ productId: req.params.productId })
            .populate('userId', 'fullname') // Chỉ lấy tên người đánh giá
            .sort({ createdAt: -1 }); // Mới nhất hiện lên đầu

        res.status(200).json({
            success: true,
            count: reviews.length,
            data: reviews
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// @desc    Xóa đánh giá (Dành cho Admin hoặc chính chủ)
// @route   DELETE /api/reviews/:id
exports.deleteReview = async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);
        if (!review) {
            return res.status(404).json({ success: false, message: "Không tìm thấy đánh giá" });
        }

        await review.deleteOne();
        res.status(200).json({ success: true, message: "Đã xóa đánh giá" });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};