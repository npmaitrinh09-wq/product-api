const assert = require('node:assert');
const Product = require('../models/product');

assert.ok(Product, 'Product model should load');
console.log('Product model test passed');