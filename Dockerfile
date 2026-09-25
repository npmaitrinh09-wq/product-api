# 1. Image nền: Node.js 24 trên Alpine Linux (nhỏ gọn)
FROM node:24-alpine

# 2. Thư mục làm việc bên trong container
WORKDIR /app

# 3. Copy file khai báo thư viện trước
COPY package.json package-lock.json ./

# 4. Cài thư viện (chỉ thư viện cần cho chạy thật)
RUN npm ci --omit=dev

# 5. Copy mã nguồn
COPY src ./src

# 6. Chế độ chạy production
ENV NODE_ENV=production

# 7. Ghi chú cổng ứng dụng sử dụng
EXPOSE 3000

# 8. Chạy bằng user thường, không dùng root (an toàn hơn)
USER node

# 9. Lệnh khởi động khi container chạy
CMD ["node", "src/server.js"]