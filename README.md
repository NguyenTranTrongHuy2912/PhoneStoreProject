# PHONESTORE PROJECT 

Dự án Website bán điện thoại Full-stack được đóng gói hoàn toàn bằng Docker, giúp triển khai nhanh chóng và đồng bộ môi trường.

## Thành viên thực hiện
1. **Nguyễn Trần Trọng Huy** - (MSSV: 23671451) - Role: Full-stack & DevOps
2. **Nguyễn Văn Quốc** - (MSSV: 23645971) - Role: Frontend UI/UX

---

## Công nghệ sử dụng
* **Frontend:** React (Vite), Tailwind CSS, Recoil/Redux.
* **Backend:** Node.js, Express.js.
* **Database:** MongoDB Atlas (Cloud).
* **DevOps:** Docker, Docker Compose.

---

## Hướng dẫn triển khai

Để chạy dự án này, yêu cầu máy tính đã cài đặt **Docker Desktop**.

### 1. Clone Project
```bash
git clone [https://github.com/](https://github.com/)[username]/PhoneStoreProject.git
cd PhoneStoreProject

# 1. Dừng và xóa các volume cũ (để xóa node_modules cũ đang bị kẹt trong Docker)
docker-compose down -v

# 2. Build lại từ đầu, ép Docker không dùng lại các tầng (layer) cũ
docker-compose build --no-cache

# 3. Khởi động lại hệ thống
docker-compose up