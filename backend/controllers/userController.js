const User = require('../models/User');
const bcrypt = require('bcryptjs');
const { generateToken } = require('../middleware/auth');

// @desc    Đăng ký người dùng mới
// @route   POST /api/users/register
exports.registerUser = async (req, res) => {
    try {
        const { fullname, email, password, phone } = req.body;

        // 1. Kiểm tra người dùng đã tồn tại chưa
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ success: false, message: 'Email đã được sử dụng' });
        }

        // 2. Mã hóa mật khẩu
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 3. Tạo user mới
        const user = await User.create({
            fullname,
            email,
            password: hashedPassword,
            phone
        });

        // 4. Tạo JWT Token
        const token = generateToken(user._id, user.role);

        res.status(201).json({
            success: true,
            message: 'Đăng ký thành công',
            token,
            data: {
                _id: user._id,
                fullname: user.fullname,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// @desc    Đăng nhập
// @route   POST /api/users/login
exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Tìm user theo email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ success: false, message: 'Email hoặc mật khẩu không đúng' });
        }

        // 2. Kiểm tra mật khẩu
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Email hoặc mật khẩu không đúng' });
        }

        // 3. Tạo JWT Token
        const token = generateToken(user._id, user.role);

        res.status(200).json({
            success: true,
            message: 'Đăng nhập thành công',
            token,
            data: {
                _id: user._id,
                fullname: user.fullname,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// @desc    Lấy thông tin cá nhân (Profile)
// @route   GET /api/users/profile/:id
exports.getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password'); // Không trả về password
        if (!user) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy người dùng' });
        }
        res.status(200).json({ success: true, data: user });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};