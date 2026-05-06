FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Mở cổng 5173 của Vite
EXPOSE 5173

# Chạy Vite với mode host để có thể truy cập từ bên ngoài container
CMD ["npm", "run", "dev", "--", "--host"]