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

// @desc    Cập nhật thông tin cá nhân
// @route   PUT /api/users/:id
exports.updateUserProfile = async (req, res) => {
    try {
        const { fullname, phone, avatar } = req.body;

        if (!req.user || (req.user._id !== req.params.id && req.user.role !== 'admin')) {
            return res.status(403).json({
                success: false,
                message: 'Bạn không có quyền cập nhật tài khoản này'
            });
        }

        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy người dùng' });
        }

        if (fullname !== undefined) user.fullname = fullname;
        if (phone !== undefined) user.phone = phone;
        if (avatar !== undefined) user.avatar = avatar;

        const updatedUser = await user.save();

        res.status(200).json({
            success: true,
            message: 'Cập nhật thông tin thành công',
            data: {
                _id: updatedUser._id,
                fullname: updatedUser.fullname,
                email: updatedUser.email,
                phone: updatedUser.phone,
                role: updatedUser.role,
                avatar: updatedUser.avatar
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// @desc    Lấy danh sách tất cả users (Admin)
// @route   GET /api/users
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password').sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            count: users.length,
            data: users
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// @desc    Cập nhật role người dùng (Admin)
// @route   PUT /api/users/:id/role
exports.updateUserRole = async (req, res) => {
    try {
        const { role } = req.body;

        if (!role || !['customer', 'admin'].includes(role)) {
            return res.status(400).json({ success: false, message: 'Role không hợp lệ' });
        }

        if (req.user && req.user._id === req.params.id && role !== 'admin') {
            return res.status(400).json({ success: false, message: 'Không thể tự hạ quyền admin' });
        }

        const user = await User.findByIdAndUpdate(
            req.params.id,
            { role },
            { new: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy người dùng' });
        }

        res.status(200).json({ success: true, data: user });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// @desc    Xóa người dùng (Admin)
// @route   DELETE /api/users/:id
exports.deleteUser = async (req, res) => {
    try {
        if (req.user && req.user._id === req.params.id) {
            return res.status(400).json({ success: false, message: 'Không thể tự xóa tài khoản' });
        }

        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy người dùng' });
        }

        await user.deleteOne();
        res.status(200).json({ success: true, message: 'Đã xóa người dùng' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};