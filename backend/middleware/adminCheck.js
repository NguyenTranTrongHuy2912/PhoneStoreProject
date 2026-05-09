/**
 * ✅ MIDDLEWARE: Kiểm tra Quyền Admin
 * 
 * Chỉ admin mới được làm những hành động nhất định
 * Phải dùng sau middleware protect (để có req.user)
 * 
 * Sử dụng:
 *   router.post('/products', protect, adminCheck, createProduct);
 *   router.put('/products/:id', protect, adminCheck, updateProduct);
 */

exports.adminCheck = (req, res, next) => {
    try {
        // Kiểm tra req.user có tồn tại không (từ middleware protect)
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Vui lòng đăng nhập trước'
            });
        }

        // Kiểm tra role là admin
        if (req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Bạn không có quyền truy cập chức năng này (chỉ admin)',
                requiredRole: 'admin',
                yourRole: req.user.role
            });
        }

        next();
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: error.message
        });
    }
};
