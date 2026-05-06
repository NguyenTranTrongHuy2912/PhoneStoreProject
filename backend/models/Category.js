const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true, 
    trim: true 
  },
  slug: { 
    type: String, 
    required: true, 
    unique: true,
    lowercase: true 
  },
  // parent_id dùng để tạo cấu trúc danh mục đa cấp (ví dụ: iPhone thuộc Điện thoại)
  parent_id: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Category', // Tham chiếu ngược lại chính collection Category
    default: null 
  }
}, { 
  timestamps: true // Tự động quản lý createdAt và updatedAt
});

// Chú thích: Mongoose sẽ tự động hiểu model này thuộc collection 'categories'
module.exports = mongoose.model('Category', categorySchema);