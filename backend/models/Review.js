const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    // ID của sản phẩm được đánh giá
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: [true, 'Review must belong to a product.']
    },
    // ID của người dùng thực hiện đánh giá
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Review must belong to a user.']
    },
    // Số sao đánh giá (ví dụ trong ảnh là 5)
    rating: {
        type: Number,
        required: [true, 'Please provide a rating.'],
        min: 1,
        max: 5
    },
    // Nội dung bình luận (ví dụ: "Máy đỉnh của đỉnh!...")
    comment: {
        type: String,
        required: [true, 'Please provide a comment.'],
        trim: true
    },
    // Thời gian tạo đánh giá
    createdAt: {
        type: Date,
        default: Date.now // Tự động lấy thời gian hiện tại nếu không cung cấp
    }
}, {
    // Tự động thêm updatedAt nếu cần, hoặc cấu hình thêm
    timestamps: false 
});

// Tạo index để tìm kiếm review theo sản phẩm nhanh hơn
reviewSchema.index({ productId: 1, createdAt: -1 });

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;