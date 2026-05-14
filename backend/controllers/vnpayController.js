/**
 * VNPay Controller
 * Xử lý: tạo URL thanh toán VNPay, callback sau thanh toán
 */
const VnPayLibrary = require('../utils/vnpayLibrary');
const Order = require('../models/Order');

// @desc    Tạo URL thanh toán VNPay
// @route   POST /api/vnpay/create-payment-url
// @access  Private (cần đăng nhập)
exports.createPaymentUrl = async (req, res) => {
    try {
        const { orderId, amount, orderDescription, orderType = 'billpayment', name } = req.body;

        if (!amount || amount <= 0) {
            return res.status(400).json({ success: false, message: 'Số tiền không hợp lệ' });
        }

        const pay = new VnPayLibrary();
        
        // Lấy timezone Việt Nam
        const now = new Date();
        const vnTime = new Date(now.toLocaleString('en-US', { timeZone: process.env.VNPAY_TIMEZONE || 'Asia/Ho_Chi_Minh' }));
        
        const formatDate = (date) => {
            const pad = (n) => String(n).padStart(2, '0');
            return `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}${pad(date.getHours())}${pad(date.getMinutes())}${pad(date.getSeconds())}`;
        };

        // Tạo txnRef: dùng timestamp để unique (tương tự DateTime.Now.Ticks trong C#)
        const txnRef = Date.now().toString();

        // Thêm các tham số theo đúng spec VNPay
        pay.addRequestData('vnp_Version', process.env.VNPAY_VERSION || '2.1.0');
        pay.addRequestData('vnp_Command', process.env.VNPAY_COMMAND || 'pay');
        pay.addRequestData('vnp_TmnCode', process.env.VNPAY_TMN_CODE);
        pay.addRequestData('vnp_Amount', String(Math.round(amount) * 100)); // VNPay tính theo đơn vị 1/100 VND
        pay.addRequestData('vnp_CreateDate', formatDate(vnTime));
        pay.addRequestData('vnp_CurrCode', process.env.VNPAY_CURR_CODE || 'VND');
        pay.addRequestData('vnp_IpAddr', VnPayLibrary.getIpAddress(req));
        pay.addRequestData('vnp_Locale', process.env.VNPAY_LOCALE || 'vn');
        pay.addRequestData('vnp_OrderInfo', `${name || 'KhachHang'} thanh toan don hang ${orderId || txnRef}`);
        pay.addRequestData('vnp_OrderType', orderType);
        pay.addRequestData('vnp_ReturnUrl', process.env.VNPAY_RETURN_URL);
        pay.addRequestData('vnp_TxnRef', txnRef);

        const paymentUrl = pay.createRequestUrl(
            process.env.VNPAY_BASE_URL,
            process.env.VNPAY_HASH_SECRET
        );

        res.status(200).json({
            success: true,
            paymentUrl,
            txnRef, // Trả về để frontend lưu lại đối chiếu
        });
    } catch (error) {
        console.error('[VNPay] createPaymentUrl error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Callback từ VNPay sau khi người dùng thanh toán
// @route   GET /api/vnpay/callback
// @access  Public (VNPay gọi trực tiếp)
exports.paymentCallback = async (req, res) => {
    try {
        const pay = new VnPayLibrary();
        const response = pay.getFullResponseData(req.query, process.env.VNPAY_HASH_SECRET);

        // Redirect về frontend với kết quả
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
        const params = new URLSearchParams({
            success: response.success ? '1' : '0',
            orderId: response.orderId || '',
            transactionId: response.transactionId || '',
            responseCode: response.vnPayResponseCode || '',
            orderInfo: response.orderDescription || '',
        });

        res.redirect(`${frontendUrl}/checkout/vnpay-return?${params.toString()}`);
    } catch (error) {
        console.error('[VNPay] callback error:', error);
        res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/checkout/vnpay-return?success=0&responseCode=99`);
    }
};

// @desc    Frontend gọi để lưu đơn hàng sau khi VNPay callback thành công
// @route   POST /api/vnpay/confirm-order
// @access  Private
exports.confirmOrder = async (req, res) => {
    try {
        const userId = req.user._id;
        const { items, totalAmount, shippingAddress, transactionId, responseCode, orderInfo } = req.body;

        if (responseCode !== '00') {
            return res.status(400).json({
                success: false,
                message: 'Giao dịch VNPay không thành công',
                responseCode,
            });
        }

        if (!items || items.length === 0) {
            return res.status(400).json({ success: false, message: 'Giỏ hàng rỗng' });
        }

        const order = await Order.create({
            userId,
            items,
            totalAmount,
            shippingAddress,
            paymentMethod: 'VNPay',
            vnpayTransactionId: transactionId,
        });

        res.status(201).json({
            success: true,
            message: 'Đơn hàng VNPay đã được tạo thành công!',
            data: order,
        });
    } catch (error) {
        console.error('[VNPay] confirmOrder error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};
