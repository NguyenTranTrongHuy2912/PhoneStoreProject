/**
 * ✅ MIDDLEWARE: Kiểm tra Input (Validation)
 * 
 * Hàm này giúp validate dữ liệu từ request
 * Tránh lỗi database, lỗi logic
 * 
 * Sử dụng: 
 *   router.post('/register', validateRegister, registerUser);
 */

// Kiểm tra email hợp lệ
const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

// Kiểm tra số điện thoại Việt Nam (10 chữ số)
const isValidPhone = (phone) => {
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
};

/**
 * Validate Register
 * Kiểm tra: fullname, email, password, phone
 */
exports.validateRegister = (req, res, next) => {
    try {
        const { fullname, email, password, phone } = req.body;

        // Kiểm tra các field bắt buộc
        if (!fullname || !email || !password || !phone) {
            return res.status(400).json({
                success: false,
                message: 'Vui lòng cung cấp tất cả các trường: fullname, email, password, phone'
            });
        }

        // Kiểm tra fullname (tối thiểu 3 ký tự)
        if (fullname.trim().length < 3) {
            return res.status(400).json({
                success: false,
                message: 'Tên phải từ 3 ký tự trở lên'
            });
        }

        // Kiểm tra email
        if (!isValidEmail(email)) {
            return res.status(400).json({
                success: false,
                message: 'Email không hợp lệ (ví dụ: user@example.com)'
            });
        }

        // Kiểm tra password (tối thiểu 6 ký tự)
        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'Mật khẩu phải từ 6 ký tự trở lên'
            });
        }

        // Kiểm tra số điện thoại
        if (!isValidPhone(phone)) {
            return res.status(400).json({
                success: false,
                message: 'Số điện thoại phải là 10 chữ số'
            });
        }

        next();
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Lỗi validation',
            error: error.message
        });
    }
};

/**
 * Validate Login
 * Kiểm tra: email, password
 */
exports.validateLogin = (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Vui lòng cung cấp email và mật khẩu'
            });
        }

        if (!isValidEmail(email)) {
            return res.status(400).json({
                success: false,
                message: 'Email không hợp lệ'
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

/**
 * Validate Profile Update
 * Kiểm tra: fullname, phone (optional)
 */
exports.validateProfile = (req, res, next) => {
    try {
        const { fullname, phone } = req.body;

        if (fullname !== undefined && fullname.trim().length < 3) {
            return res.status(400).json({
                success: false,
                message: 'Tên phải từ 3 ký tự trở lên'
            });
        }

        if (phone !== undefined && !isValidPhone(phone)) {
            return res.status(400).json({
                success: false,
                message: 'Số điện thoại phải là 10 chữ số'
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

/**
 * Validate Product (Create/Update)
 * Kiểm tra: name, brand (bắt buộc); variants (optional nhưng nếu có phải hợp lệ)
 * Lưu ý: Product model KHÔNG có field 'price' trực tiếp, giá nằm trong variants[].price
 */
exports.validateProduct = (req, res, next) => {
    try {
        const { name, brand, variants } = req.body;

        // Kiểm tra các field bắt buộc
        if (!name || !brand) {
            return res.status(400).json({
                success: false,
                message: 'Vui lòng cung cấp: name và brand'
            });
        }

        if (name.trim().length < 3) {
            return res.status(400).json({
                success: false,
                message: 'Tên sản phẩm phải từ 3 ký tự trở lên'
            });
        }

        if (brand.trim().length < 2) {
            return res.status(400).json({
                success: false,
                message: 'Tên thương hiệu phải từ 2 ký tự trở lên'
            });
        }

        // Nếu có variants thì validate từng variant
        if (variants !== undefined) {
            if (!Array.isArray(variants) || variants.length === 0) {
                return res.status(400).json({
                    success: false,
                    message: 'variants phải là một mảng và không được rỗng'
                });
            }

            for (let i = 0; i < variants.length; i++) {
                const variant = variants[i];
                if (typeof variant.price !== 'number' || variant.price <= 0) {
                    return res.status(400).json({
                        success: false,
                        message: `Variant [${i}]: price phải là số dương`
                    });
                }
                if (typeof variant.stock !== 'number' || variant.stock < 0) {
                    return res.status(400).json({
                        success: false,
                        message: `Variant [${i}]: stock phải là số không âm`
                    });
                }
            }
        }

        next();
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

/**
 * Validate Review
 * Kiểm tra: productId, rating, comment
 * Lưu ý: userId lấy từ req.user (JWT token), không cần trong body
 */
exports.validateReview = (req, res, next) => {
    try {
        const { productId, rating, comment } = req.body;

        if (!productId || !rating || !comment) {
            return res.status(400).json({
                success: false,
                message: 'Vui lòng cung cấp: productId, rating, comment'
            });
        }

        if (typeof rating !== 'number' || rating < 1 || rating > 5) {
            return res.status(400).json({
                success: false,
                message: 'Rating phải từ 1 đến 5 sao'
            });
        }

        if (comment.trim().length < 5) {
            return res.status(400).json({
                success: false,
                message: 'Bình luận phải từ 5 ký tự trở lên'
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


/**
 * Validate Order
 * Kiểm tra: items, totalAmount, shippingAddress, paymentMethod
 * Lưu ý: userId lấy từ req.user (JWT token), KHÔNG cần trong body để tránh giả mạo
 */
exports.validateOrder = (req, res, next) => {
    try {
        const { items, totalAmount, shippingAddress, paymentMethod } = req.body;

        if (!items || !totalAmount || !shippingAddress || !paymentMethod) {
            return res.status(400).json({
                success: false,
                message: 'Vui lòng cung cấp: items, totalAmount, shippingAddress, paymentMethod'
            });
        }

        if (!Array.isArray(items) || items.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Giỏ hàng không được rỗng'
            });
        }

        if (typeof totalAmount !== 'number' || totalAmount <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Tổng tiền phải là số dương'
            });
        }

        // Validate từng item trong giỏ hàng
        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            if (!item.productId) {
                return res.status(400).json({
                    success: false,
                    message: `Item [${i}]: productId là bắt buộc`
                });
            }
            if (typeof item.quantity !== 'number' || item.quantity < 1) {
                return res.status(400).json({
                    success: false,
                    message: `Item [${i}]: quantity phải >= 1`
                });
            }
            if (typeof item.price !== 'number' || item.price <= 0) {
                return res.status(400).json({
                    success: false,
                    message: `Item [${i}]: price phải là số dương`
                });
            }
        }

        next();
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: error.message
        });
    }
};
