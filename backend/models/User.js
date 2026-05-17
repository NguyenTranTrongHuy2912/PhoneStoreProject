const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    // Họ và tên người dùng (ví dụ: "Nguyễn Văn A")
    fullname: {
        type: String,
        required: [true, 'Please provide your full name.'],
        trim: true
    },
    // Email đăng nhập, đảm bảo là duy nhất
    email: {
        type: String,
        required: [true, 'Please provide your email.'],
        unique: true,
        lowercase: true,
        trim: true
    },
    // Mật khẩu (trong ảnh đang là dạng đã hash $2b$10$...)
    password: {
        type: String,
        required: [true, 'Please provide a password.'],
        minlength: 6
    },
    // Số điện thoại
    phone: {
        type: String,
        required: [true, 'Please provide your phone number.'],
        trim: true
    },
    // Danh sách địa chỉ (dạng Array như trong ảnh)
    addresses: [
        {
            street: String,
            city: String,
            state: String,
            country: String,
            isDefault: Boolean
        }
    ],
    // Vai trò của người dùng (mặc định là customer)
    role: {
        type: String,
        enum: ['customer', 'admin'],
        default: 'customer'
    },
    // Thời gian tạo tài khoản
    createdAt: {
        type: Date,
        default: Date.now
    },
    // OTP để reset mật khẩu
    resetPasswordOtp: {
        type: String,
        default: null
    },
    resetPasswordOtpExpires: {
        type: Date,
        default: null
    }
}, {
    timestamps: true // Tự động tạo và cập nhật createdAt, updatedAt
});

const User = mongoose.model('User', userSchema);

module.exports = User;