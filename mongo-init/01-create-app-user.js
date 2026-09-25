// Script này chỉ chạy MỘT LẦN, khi volume MongoDB còn trống (lần khởi tạo đầu tiên).
// Các giá trị được lấy từ biến môi trường, không ghi mật khẩu trong code.
const dbName = process.env.APP_DB_NAME;
const user = process.env.APP_DB_USER;
const pwd = process.env.APP_DB_PASSWORD;

db.getSiblingDB(dbName).createUser({
  user: user,
  pwd: pwd,
  roles: [{ role: 'readWrite', db: dbName }],
});

print(`Da tao user ${user} voi quyen readWrite tren database ${dbName}`);