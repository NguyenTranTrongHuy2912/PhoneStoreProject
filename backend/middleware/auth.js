const jwt = require('jsonwebtoken');

/**
 * ✅ MIDDLEWARE: Xác thực JWT Token
 * 
 * Kiểm tra token trong header Authorization: "Bearer <token>"
 * Nếu valid → lưu user info vào req.user
 * Nếu không valid → trả lỗi 401
 * 
 * Sử dụng:
 *   router.get('/profile/:id', protect, getUserProfile);
 */
exports.protect = async (req, res, next) => {
    try {
        // 1. Lấy token từ header
        // Header format: "Authorization: Bearer eyJhbGc..."
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: 'Không tìm thấy token, vui lòng đăng nhập'
            });
        }

        // 2. Tách token từ "Bearer <token>"
        const token = authHeader.split(' ')[1];

        // 3. Xác minh token (kiểm tra chữ ký)
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');

        // 4. Lưu user info vào request object
        // Các middleware tiếp theo và controller có thể dùng req.user
        req.user = decoded;

        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: 'Token không hợp lệ hoặc đã hết hạn',
            error: error.message
        });
    }
};

/**
 * ✅ MIDDLEWARE: Tạo JWT Token
 * 
 * Được gọi từ controller để tạo token
 * Dùng khi login/register thành công
 * 
 * Ví dụ: 
 *   const token = generateToken(user._id, user.role);
 */
exports.generateToken = (userId, role = 'customer') => {
    return jwt.sign(
        { _id: userId, role },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '7d' } // Token hết hạn sau 7 ngày
    );
};
