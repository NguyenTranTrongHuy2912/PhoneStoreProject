const Order = require('../models/Order');

// @desc    Tạo đơn hàng mới (Checkout)
// @route   POST /api/orders
exports.createOrder = async (req, res) => {
    try {
        // Lấy userId từ JWT token (req.user) thay vì body để đảm bảo bảo mật
        const userId = req.user._id;
        const { items, totalAmount, shippingAddress, paymentMethod } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({ success: false, message: "Giỏ hàng rỗng" });
        }

        const order = await Order.create({
            userId,
            items,
            totalAmount,
            shippingAddress,
            paymentMethod
        });

        res.status(201).json({
            success: true,
            message: "Đặt hàng thành công!",
            data: order
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// @desc    Lấy danh sách đơn hàng của một User (Lịch sử mua hàng)
// @route   GET /api/orders/user/:userId
exports.getUserOrders = async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.params.userId })
            .populate('userId', 'fullname email phone')
            .sort({ createdAt: -1 });
        
        res.status(200).json({
            success: true,
            count: orders.length,
            data: orders
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// @desc    Lấy chi tiết một đơn hàng
// @route   GET /api/orders/:id
exports.getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('userId', 'fullname email phone') // Lấy thông tin khách hàng
            .populate('items.productId', 'name images brand'); // Lấy thêm ảnh sản phẩm

        if (!order) {
            return res.status(404).json({ success: false, message: "Không tìm thấy đơn hàng" });
        }

        res.status(200).json({ success: true, data: order });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// @desc    Cập nhật trạng thái đơn hàng (Dành cho Admin)
// @route   PUT /api/orders/:id/status
exports.updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const order = await Order.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true, runValidators: true }
        ).populate('userId', 'fullname email phone')
         .populate('items.productId', 'name images brand');

        res.status(200).json({ success: true, data: order });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// @desc    Lấy danh sách tất cả đơn hàng (Admin)
// @route   GET /api/orders
exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate('userId', 'fullname email phone')
            .populate('items.productId', 'name images brand')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: orders.length,
            data: orders
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};