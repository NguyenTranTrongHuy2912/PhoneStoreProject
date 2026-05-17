require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db.js');
const productRoutes = require('./routes/productRoutes');
const userRoutes = require('./routes/userRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const orderRoutes = require('./routes/orderRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const vnpayRoutes = require('./routes/vnpayRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');
const path = require('path');

const app = express();

// 1. Kết nối Database (Sẽ dùng MONGO_URI có chứa PhoneStoreDB từ .env hoặc Render)
connectDB();

// 2. Middleware
// Cho phép URL của Vercel truy cập vào API khi ở production, còn ở development thì cho phép tất cả (để test dễ dàng)
app.use(cors({
    origin: process.env.NODE_ENV === 'production'
        ? 'https://phone-store-project-jqkl.vercel.app/'
        : '*'
}));
app.use(express.json());

// 3. Health Check Route (Dùng để test nhanh xem server live chưa)
app.get('/', (req, res) => {
    res.send('API PhoneStoreProject đang chạy mượt mà...');
});

// Serve static files from the uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 4. Routes chính
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/vnpay', vnpayRoutes);
app.use('/api/upload', uploadRoutes);

// 5. 404 Handler (phải đặt trước error handler)
app.use(notFoundHandler);

// 6. Error Handler Middleware (phải đặt cuối cùng)
app.use(errorHandler);

// 7. Cấu hình Port linh hoạt cho Render
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
    console.log(`Mode: ${process.env.NODE_ENV || 'development'}`);
});