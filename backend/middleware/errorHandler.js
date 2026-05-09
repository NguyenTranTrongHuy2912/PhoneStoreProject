/**
 * ✅ MIDDLEWARE: Xử lý Lỗi Thống Nhất
 * 
 * Middleware này bắt tất cả lỗi từ các route
 * Và trả về response format thống nhất
 * 
 * Phải được đặt ở cuối server.js (sau tất cả routes)
 * 
 * Sử dụng:
 *   // Trong route hoặc controller, throw error:
 *   throw new Error("Something went wrong");
 *   
 *   // Hoặc dùng next(error):
 *   next(new Error("Something went wrong"));
 */

class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
    }
}

/**
 * Global Error Handler Middleware
 * Phải có 4 tham số (err, req, res, next) để Express nhận diện
 */
exports.errorHandler = (err, req, res, next) => {
    // Mặc định
    let statusCode = err.statusCode || 500;
    let message = err.message || 'Lỗi server';

    // Xử lý từng loại lỗi cụ thể
    
    // 1. MongoDB Duplicate Key Error (Email đã tồn tại)
    if (err.code === 11000) {
        statusCode = 400;
        const field = Object.keys(err.keyPattern)[0];
        message = `${field} đã tồn tại trong hệ thống`;
    }

    // 2. MongoDB Cast Error (ID không hợp lệ)
    if (err.name === 'CastError') {
        statusCode = 400;
        message = 'ID không hợp lệ';
    }

    // 3. Mongoose Validation Error
    if (err.name === 'ValidationError') {
        statusCode = 400;
        const messages = Object.values(err.errors).map(e => e.message);
        message = messages.join(', ');
    }

    // 4. JWT Token Error
    if (err.name === 'JsonWebTokenError') {
        statusCode = 401;
        message = 'Token không hợp lệ';
    }

    // 5. JWT Expired Error
    if (err.name === 'TokenExpiredError') {
        statusCode = 401;
        message = 'Token đã hết hạn, vui lòng đăng nhập lại';
    }

    // Trả về response thống nhất
    return res.status(statusCode).json({
        success: false,
        message: message,
        statusCode: statusCode,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
};

/**
 * 404 Not Found Handler
 * Dùng cho các route không tồn tại
 */
exports.notFoundHandler = (req, res, next) => {
    const message = `Route ${req.originalUrl} không tồn tại`;
    const err = new AppError(message, 404);
    next(err);
};

module.exports = {
    AppError,
    errorHandler: exports.errorHandler,
    notFoundHandler: exports.notFoundHandler
};
