require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db.js');

const app = express();

// Kết nối Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json()); // Để server hiểu được dữ liệu JSON từ request

// Routes (Khai báo sau khi bạn tạo file trong thư mục routes)
// app.use('/api/users', require('./routes/userRoutes'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));