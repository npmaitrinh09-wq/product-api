const express = require('express');
const Product = require('../models/product.model');

const router = express.Router();

// READ - Lấy tất cả sản phẩm: GET /api/products
router.get('/', async (req, res) => {
  const products = await Product.find().sort({ pid: 1 });
  res.json(products);
});

// READ - Lấy 1 sản phẩm theo pid: GET /api/products/:pid
router.get('/:pid', async (req, res) => {
  const product = await Product.findOne({ pid: req.params.pid });
  if (!product) {
    return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
  }
  res.json(product);
});

// CREATE - Thêm sản phẩm: POST /api/products
router.post('/', async (req, res) => {
  const { pid, pname, price, quantity } = req.body ?? {};
  const product = await Product.create({ pid, pname, price, quantity });
  res.status(201).json(product);
});

// UPDATE - Sửa sản phẩm: PUT /api/products/:pid
router.put('/:pid', async (req, res) => {
  const { pname, price, quantity } = req.body ?? {};
  const product = await Product.findOneAndUpdate(
    { pid: req.params.pid },
    { pname, price, quantity },
    { returnDocument: 'after', runValidators: true } // ← ĐÃ SỬA
  );
  if (!product) {
    return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
  }
  res.json(product);
});

// DELETE - Xóa sản phẩm: DELETE /api/products/:pid
router.delete('/:pid', async (req, res) => {
  const product = await Product.findOneAndDelete({ pid: req.params.pid });
  if (!product) {
    return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
  }
  res.json({ message: 'Đã xóa sản phẩm', product });
});

module.exports = router;