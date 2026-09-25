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

# 8. Healthcheck đóng gói sẵn trong image (MỚI)
HEALTHCHECK --interval=10s --timeout=5s --start-period=15s --retries=3 \
    CMD wget -q --spider http://127.0.0.1:3000/health || exit 1

# 9. Chạy bằng user thường, không dùng root (an toàn hơn)
USER node

# 10. Lệnh khởi động khi container chạy
CMD ["node", "src/server.js"]