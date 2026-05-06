const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Kết nối tới MongoDB Atlas bằng URI từ biến môi trường
    const conn = await mongoose.connect(process.env.MONGO_URI);

    // In ra thông báo kèm theo tên Host và tên Database để dễ dàng debug
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    console.log(`Database: ${conn.connection.name}`); 
    
  } catch (err) {
    console.error(`Error: ${err.message}`);
    // Dừng tiến trình nếu kết nối thất bại
    process.exit(1);
  }
};

module.exports = connectDB;