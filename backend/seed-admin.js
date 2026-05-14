/**
 * seed-admin.js
 * Tạo tài khoản admin mặc định nếu chưa tồn tại
 * Chạy: node seed-admin.js
 */
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const MONGO_URI = process.env.MONGO_URI;

const userSchema = new mongoose.Schema({
  fullname: String,
  email:    { type: String, unique: true, lowercase: true },
  password: String,
  phone:    String,
  role:     { type: String, default: 'customer' },
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Kết nối MongoDB thành công');

    const existing = await User.findOne({ email: 'admin@gmail.com' });
    if (existing) {
      // Nếu đã tồn tại, đảm bảo role là admin
      if (existing.role !== 'admin') {
        existing.role = 'admin';
        await existing.save();
        console.log('✅ Đã cập nhật role thành admin cho: admin@gmail.com');
      } else {
        console.log('ℹ️  Tài khoản admin@gmail.com đã tồn tại với role admin');
      }
    } else {
      const hashed = await bcrypt.hash('123456', 10);
      await User.create({
        fullname: 'Admin PhoneStore',
        email:    'admin@gmail.com',
        password: hashed,
        phone:    '0900000000',
        role:     'admin',
      });
      console.log('✅ Đã tạo tài khoản admin:');
      console.log('   Email   : admin@gmail.com');
      console.log('   Password: 123456');
    }

    await mongoose.disconnect();
    console.log('✅ Xong!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Lỗi:', err.message);
    process.exit(1);
  }
}

seed();
