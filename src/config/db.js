const mongoose = require('mongoose');

async function connectDB() {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    throw new Error('Thiếu biến MONGO_URI trong file .env');
  }

  await mongoose.connect(uri);

  const { host, port, name } = mongoose.connection;
  console.log(`Da ket noi MongoDB: ${host}:${port}/${name}`);
}

module.exports = connectDB;