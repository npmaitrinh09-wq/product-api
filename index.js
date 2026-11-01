require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const Product = require('./models/product');

const app = express();
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.post('/products', async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get('/products', async (req, res) => {
  const products = await Product.find().sort({ pid: 1 });
  res.json(products);
});

app.get('/products/:pid', async (req, res) => {
  const product = await Product.findOne({ pid: Number(req.params.pid) });
  if (!product) return res.status(404).json({ error: 'Product not found' });
  res.json(product);
});

app.put('/products/:pid', async (req, res) => {
  try {
    const product = await Product.findOneAndUpdate(
      { pid: Number(req.params.pid) },
      req.body,
      { new: true, runValidators: true }
    );
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete('/products/:pid', async (req, res) => {
  const product = await Product.findOneAndDelete({ pid: Number(req.params.pid) });
  if (!product) return res.status(404).json({ error: 'Product not found' });
  res.json({ message: 'Product deleted' });
});

const PORT = process.env.PORT || 3000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.error('MongoDB connection error:', err.message));
  