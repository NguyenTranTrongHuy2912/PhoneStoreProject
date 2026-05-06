const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  // Liên kết tới người dùng thực hiện đơn hàng
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // Ngày đặt hàng (Sử dụng Date cho dữ liệu như 2024-04-15...)
  orderDate: {
    type: Date,
    default: Date.now
  },
  // Mảng các sản phẩm trong đơn hàng
  items: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
      },
      name: String,
      quantity: { type: Number, required: true },
      price: { type: Number, required: true },
      sku: String
    }
  ],
  // Tổng tiền đơn hàng
  totalAmount: {
    type: Number,
    required: true
  },
  // Địa chỉ giao hàng
  shippingAddress: {
    type: String,
    required: true
  },
  // Phương thức thanh toán (ví dụ: "COD")
  paymentMethod: {
    type: String,
    required: true
  },
  // Trạng thái đơn hàng (ví dụ: "Processing")
  status: {
    type: String,
    default: 'Processing',
    enum: ['Processing', 'Shipped', 'Delivered', 'Cancelled']
  }
}, { 
  timestamps: true // Tự động tạo createdAt và updatedAt
});

module.exports = mongoose.model('Order', orderSchema);