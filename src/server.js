require('dotenv').config({ quiet: true });
const express = require('express');
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const productRoutes = require('./routes/product.routes');

const app = express();
const PORT = process.env.PORT || 3000;

// Đọc dữ liệu JSON trong body của request
app.use(express.json());

// Route kiểm tra nhanh + hiển thị phiên bản đang chạy
app.get('/', (req, res) => {
  res.json({
    message: 'Product API dang chay',
    version: process.env.APP_VERSION || 'dev',
  });
});

// Healthcheck - kiểm tra API và kết nối MongoDB
app.get('/health', (req, res) => {
  const dbConnected = mongoose.connection.readyState === 1;
  res.status(dbConnected ? 200 : 503).json({
    status: dbConnected ? 'ok' : 'error',
    database: dbConnected ? 'connected' : 'disconnected',
    uptime: Math.round(process.uptime()),
  });
});

// Gắn các API sản phẩm vào đường dẫn /api/products
app.use('/api/products', productRoutes);

// Đường dẫn không tồn tại
app.use((req, res) => {
  res.status(404).json({ message: 'Không tìm thấy đường dẫn' });
});

// Bộ xử lý lỗi chung
app.use((err, req, res, next) => {
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({ message: 'Dữ liệu không hợp lệ', errors });
  }
  if (err.name === 'CastError') {
    return res.status(400).json({ message: `Giá trị không hợp lệ cho trường ${err.path}` });
  }
  if (err.code === 11000) {
    return res.status(409).json({ message: 'pid đã tồn tại' });
  }
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ message: 'JSON không hợp lệ' });
  }
  console.error(err);
  res.status(500).json({ message: 'Lỗi máy chủ' });
});

// Kết nối DB xong mới mở server
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server dang chay tai http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Khong ket noi duoc MongoDB:', err.message);
    process.exit(1);
  });