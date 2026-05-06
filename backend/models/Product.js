const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  brand: { type: String, required: true },
  // Dùng ObjectId và ref để liên kết tới collection categories
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' }, 
  description: { type: String },
  
  // Đối tượng specifications lồng nhau
  specifications: {
    screen: String,
    chip: String,
    battery: String,
    os: String
  },

  // Mảng các object cho các phiên bản (variants)
  variants: [
    {
      color: String,
      storage: String,
      price: Number,
      stock: Number,
      sku: String
    }
  ],

  // Mảng các chuỗi tên file ảnh
  images: [String],

  // Đối tượng đánh giá
  ratings: {
    average: { type: Number, default: 0 },
    count: { type: Number, default: 0 }
  }
}, { 
  timestamps: true // Tự động tạo createdAt và updatedAt
});

module.exports = mongoose.model('Product', productSchema);