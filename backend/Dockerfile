# Sử dụng Node phiên bản 20
FROM node:20-alpine

# Tạo thư mục làm việc trong container
WORKDIR /app

# Copy package.json và cài đặt thư viện trước để tận dụng cache
COPY package*.json ./
RUN npm install

# Copy toàn bộ mã nguồn backend
COPY . .

# Mở cổng 5000
EXPOSE 5000

# Lệnh chạy server
CMD ["node", "server.js"]