 # 📱 PhoneStore — Website Bán Điện Thoại Full-Stack

> **Đồ án môn học: Phát triển ứng dụng Web — Nhóm 07**
>
> Hệ thống thương mại điện tử bán điện thoại được xây dựng theo kiến trúc Full-stack hiện đại, hỗ trợ Docker hóa toàn diện ở môi trường Local và triển khai tự động (CI/CD) lên các nền tảng Điện toán đám mây.

---

## 👥 Thành viên nhóm

| STT | Họ và tên | MSSV | Vai trò |
|:---:|-----------|:----:|---------|
| 1 | **Nguyễn Trần Trọng Huy** | 23671451 | Full-stack Developer & DevOps Engineer |
| 2 | **Nguyễn Văn Quốc** | 23645971 | Frontend Developer |

---

## 🏗️ Kiến trúc & Công nghệ

### Môi trường Local (Docker)

Toàn bộ hệ thống được đóng gói bằng **Docker Compose**, đảm bảo đồng bộ môi trường giữa các thành viên và dễ dàng khởi chạy trên mọi máy tính.

### Môi trường Cloud Production

| Tầng | Công nghệ | Local | Cloud |
|------|-----------|:-----:|:-----:|
| **Frontend** | React (Vite) + Tailwind CSS + Redux | Docker · Port `5173` | **Vercel** |
| **Backend** | Node.js + Express.js | Docker · Port `5000` | **Render** |
| **Database** | MongoDB | Docker Network | **MongoDB Atlas** |
| **Media** | Cloudinary API | Local Stream | **Cloudinary Cloud** |

---

## ✅ Tính năng đã hoàn thiện

- [x] **Dữ liệu thực tế** — 52 sản phẩm điện thoại kết nối trực tiếp từ MongoDB
- [x] **Bộ lọc & Sắp xếp** — Lọc theo thương hiệu, sắp xếp theo giá / tên A–Z
- [x] **Phân trang** — Xử lý ở cả Client và Server (`skip`, `limit`), tối ưu tốc độ tải
- [x] **Xác thực bảo mật** — Đăng ký / Đăng nhập bằng JWT, mật khẩu mã hóa với Bcrypt
- [x] **E-Commerce Flow** — Giỏ hàng, cập nhật số lượng, đặt hàng
- [x] **Đánh giá sản phẩm** — Viết bình luận, tự động tính điểm sao trung bình
- [x] **Quản lý Media** — Upload ảnh sản phẩm thẳng lên Cloudinary Cloud
- [x] **DevOps Ready** — Docker hóa toàn bộ, hỗ trợ Hot-Reload khi phát triển

---

## 🚀 Hướng dẫn chạy Local

> **Yêu cầu duy nhất:** Máy tính đã cài **[Docker Desktop](https://www.docker.com/products/docker-desktop/)**.

### Bước 1 — Clone mã nguồn

```bash
git clone https://github.com/NguyenTranTrongHuy2912/PhoneStoreProject.git
cd PhoneStoreProject
```

### Bước 2 — Tạo file cấu hình môi trường

```bash
cp .env.example .env
```

> Không cần chỉnh sửa thêm — file `.env.example` đã chứa sẵn thông tin kết nối Database test của nhóm.

### Bước 3 — Khởi chạy hệ thống

```bash
docker-compose up
```

Sau khi khởi động thành công:

| Dịch vụ | Địa chỉ |
|---------|---------|
| 🌐 Giao diện người dùng (Frontend) | http://localhost:5173 |
| 📡 Cổng kết nối dữ liệu (Backend API) | http://localhost:5000 |

---

## 🛠️ Xử lý sự cố Docker

Nếu gặp lỗi do cache `node_modules` cũ, chạy lần lượt các lệnh sau:

```bash
# 1. Dừng hệ thống và xóa Volumes cũ
docker-compose down -v

# 2. Build lại Frontend, bỏ qua cache
docker-compose build --no-cache frontend

# 3. Khởi động lại toàn bộ hệ thống
docker-compose up --build
```

---

## 🔐 Tài khoản dùng thử

| Vai trò | Email | Mật khẩu | Quyền hạn |
|---------|-------|:---------:|-----------|
| **Quản trị viên** | `admin@phonestore.vn` | `123456` | Dashboard, quản lý sản phẩm, xem đơn hàng |
| **Khách hàng** | `huytrong@gmail.com` | `123456` | Xem sản phẩm, giỏ hàng, đặt hàng, đánh giá |

---

## 🌐 Demo Online

Dự án đã được triển khai và có thể truy cập trực tuyến:

- **Frontend (Vercel):** *https://phone-store-project-jqkl.vercel.app/*
- **Backend API (Render):** *https://phonestore-backend-svug.onrender.com*

---

> Cảm ơn Thầy/Cô đã dành thời gian xem xét và đánh giá dự án của Nhóm 07!
