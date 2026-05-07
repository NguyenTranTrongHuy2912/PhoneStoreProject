# PHONESTORE PROJECT

Dự án Website bán điện thoại Full-stack được đóng gói hoàn toàn bằng Docker, giúp triển khai nhanh chóng và đồng bộ môi trường.

---

## Thành viên thực hiện

| STT | Họ và tên | MSSV | Vai trò |
|-----|-----------|------|---------|
| 1 | **Nguyễn Trần Trọng Huy** | 23671451 | Full-stack & DevOps |
| 2 | **Nguyễn Văn Quốc** | [Cập nhật] | Frontend UI/UX |

---

## Công nghệ sử dụng

| Tầng | Công nghệ |
|------|-----------|
| **Frontend** | React (Vite), Tailwind CSS, Recoil / Redux |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB Atlas (Cloud) |
| **DevOps** | Docker, Docker Compose |

---

## Hướng dẫn triển khai (Dành cho Giảng viên)

> Yêu cầu duy nhất: máy tính đã cài đặt **[Docker Desktop](https://www.docker.com/products/docker-desktop/)**.

### Bước 1 — Clone Project

```bash
git clone https://github.com/NguyenTranTrongHuy2912/PhoneStoreProject.git
cd PhoneStoreProject
```

### Bước 2 — Cấu hình biến môi trường (`.env`)

> Để bảo mật, file `.env` không được commit lên GitHub. Nhóm đã chuẩn bị sẵn file mẫu `.env.example`.

```bash
cp backend/.env.example backend/.env
```

> Biến `MONGO_URI` trong file mẫu đã trỏ sẵn tới Cluster test của nhóm — Thầy/Cô **không cần chỉnh sửa** thêm.

### Bước 3 — Khởi chạy bằng Docker

Tại thư mục gốc của dự án, chạy **một lệnh duy nhất**:

```bash
docker-compose up
```

Hệ thống sẽ tự động build Image và khởi chạy tất cả dịch vụ:

| Dịch vụ | Địa chỉ truy cập |
|---------|-----------------|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:5000 |

---

##  Tài khoản thử nghiệm

> Để thuận tiện cho việc chấm điểm các tính năng yêu cầu đăng nhập:

| Vai trò | Email | Mật khẩu |
|---------|-------|----------|
| Admin | admin@gmail.com | `123456` |
| Khách hàng | huytrong@gmail.com | `123456` |

---

## Các tính năng chính

- [x] Xem danh sách **52 sản phẩm** điện thoại từ MongoDB
- [x] Bộ lọc thông minh theo **thương hiệu** (Apple, Samsung, ...)
- [x] **Đăng ký / Đăng nhập** (Mật khẩu được mã hóa bằng Bcrypt)
- [x] **Giỏ hàng** (Cart) và quy trình **Đặt hàng** (Checkout)
- [x] **Đánh giá sản phẩm** (Review) và tính điểm sao trung bình
- [x] **Docker hóa** toàn bộ hệ thống (Hot Reload trong môi trường Dev)

---

>  Chúc Thầy có trải nghiệm tốt khi chấm điểm dự án của nhóm!
