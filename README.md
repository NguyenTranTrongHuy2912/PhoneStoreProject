# PhoneStore

Website thương mại điện tử bán điện thoại, xây dựng theo kiến trúc full-stack (React + Node.js + MongoDB), đóng gói bằng Docker và triển khai lên cloud.

**Demo trực tuyến:** [phone-store-project-jqkl.vercel.app]

<!-- Thêm 2-3 ảnh chụp màn hình hoặc 1 GIF demo ở đây, ví dụ:
![Trang chủ](docs/home.png)
![Giỏ hàng](docs/cart.png)
-->

## Tính năng

- Danh sách 52 sản phẩm, lọc theo thương hiệu, sắp xếp theo giá hoặc tên A-Z
- Phân trang phía server (`skip`, `limit`)
- Đăng ký, đăng nhập bằng JWT, mật khẩu mã hóa bằng Bcrypt
- Giỏ hàng, cập nhật số lượng, đặt hàng
- Đánh giá sản phẩm, tự động tính điểm sao trung bình
- Trang quản trị: quản lý sản phẩm, xem đơn hàng
- Upload ảnh sản phẩm lên Cloudinary

## Công nghệ

| Tầng | Công nghệ | Triển khai |
| --- | --- | --- |
| Frontend | React (Vite), Tailwind CSS, Redux | Vercel |
| Backend | Node.js, Express.js | Render |
| Database | MongoDB | MongoDB Atlas |
| Media | Cloudinary | Cloudinary |
| Đóng gói | Docker, Docker Compose | |

## Chạy trên máy cá nhân

Yêu cầu: [Docker Desktop](https://www.docker.com/products/docker-desktop/).

```bash
git clone https://github.com/NguyenTranTrongHuy2912/PhoneStoreProject.git
cd PhoneStoreProject
cp .env.example .env
```

Mở file `.env` và điền các giá trị của bạn:

| Biến | Ý nghĩa |
| --- | --- |
| `MONGO_URI` | Chuỗi kết nối MongoDB (Atlas hoặc MongoDB chạy local) |
| `JWT_SECRET` | Chuỗi bí mật dùng để ký JWT |
| `CLOUDINARY_*` | Thông tin Cloudinary, chỉ cần nếu dùng tính năng upload ảnh |

Khởi chạy:

```bash
docker-compose up
```

- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

Nếu gặp lỗi do cache `node_modules` cũ:

```bash
docker-compose down -v
docker-compose build --no-cache frontend
docker-compose up --build
```

## Cấu trúc thư mục

```
PhoneStoreProject/
├── backend/            # API Express, models, routes, middleware
├── frontend/           # Ứng dụng React (Vite)
├── docker-compose.yml
└── .env.example
```

## Nhóm thực hiện

Đồ án môn Phát triển Giao diện Ứng dụng, Đại học Công nghiệp TP.HCM (IUH).

| Thành viên | Vai trò |
| --- | --- |
| [Nguyễn Trần Trọng Huy](https://github.com/NguyenTranTrongHuy2912) | Full-stack, DevOps |
| [Nguyễn Văn Quốc](https://github.com/Quoc05) | Frontend |

## Hướng phát triển

- Thanh toán trực tuyến
- Viết test tự động cho API
- CI chạy lint và test bằng GitHub Actions
