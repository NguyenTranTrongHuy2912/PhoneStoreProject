require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db.js');
const productRoutes = require('./routes/productRoutes');
const userRoutes = require('./routes/userRoutes');
const categoryRoutes = require('./routes/categoryRoutes');


const app = express();

// 1. Kết nối Database (Sẽ dùng MONGO_URI có chứa PhoneStoreDB từ .env hoặc Render)
connectDB();

// 2. Middleware
// Cho phép URL của Vercel truy cập vào (Thay URL dưới bằng link Vercel của bạn)
app.use(cors({
    origin: process.env.NODE_ENV === 'production'
        ? 'https://ten-du-an-cua-ban.vercel.app'
        : '*'
}));
app.use(express.json());

// 3. Health Check Route (Dùng để test nhanh xem server live chưa)
app.get('/', (req, res) => {
    res.send('API PhoneStoreProject đang chạy mượt mà...');
});

// 4. Routes chính
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/categories', categoryRoutes);

// 5. Cấu hình Port linh hoạt cho Render
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
    console.log(`Mode: ${process.env.NODE_ENV || 'development'}`);
});