const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    // pid: INT, khóa chính (PK)
    pid: {
      type: Number,
      required: [true, 'pid là bắt buộc'],
      unique: true,
      min: [1, 'pid phải lớn hơn 0'],
      validate: {
        validator: Number.isInteger,
        message: 'pid phải là số nguyên',
      },
    },
    // pname: VARCHAR(100)
    pname: {
      type: String,
      required: [true, 'pname là bắt buộc'],
      trim: true,
      maxlength: [100, 'pname tối đa 100 ký tự'],
    },
    // price: DECIMAL(10,2)
    price: {
      type: Number,
      required: [true, 'price là bắt buộc'],
      min: [0, 'price không được âm'],
      max: [99999999.99, 'price vượt quá giới hạn DECIMAL(10,2)'],
      set: (v) => (typeof v === 'number' ? Math.round(v * 100) / 100 : v),
    },
    // quantity: INT
    quantity: {
      type: Number,
      required: [true, 'quantity là bắt buộc'],
      min: [0, 'quantity không được âm'],
      validate: {
        validator: Number.isInteger,
        message: 'quantity phải là số nguyên',
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);