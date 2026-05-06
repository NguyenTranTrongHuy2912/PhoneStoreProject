# Hướng dẫn AI làm việc với dự án Phone Store

## Tổng quan dự án

Đây là một trang web bán điện thoại, được xây dựng theo kiến trúc **client-server tách biệt**:

| Thành phần | Công nghệ | Thư mục |
|------------|-----------|---------|
| Backend    | Node.js + Express + MongoDB (Mongoose) | `backend/` |
| Frontend   | Vite + React | `frontend/` |

---

## Cấu trúc thư mục

```
phone-store-project/
├── backend/
│   ├── config/db.js          # Kết nối MongoDB
│   ├── controllers/          # Logic xử lý request (tách khỏi routes)
│   ├── models/               # Mongoose Schema (User.js, Product.js)
│   ├── routes/               # Định nghĩa API endpoints
│   ├── .env                  # PORT, MONGODB_URI
│   └── server.js             # Entry point backend
├── frontend/
│   ├── public/               # Tài nguyên tĩnh (favicon, ảnh ngoài src)
│   ├── src/
│   │   ├── assets/           # CSS global, ảnh dùng trong component
│   │   ├── components/       # UI dùng chung: Navbar, Footer, Card...
│   │   ├── pages/            # Mỗi file = 1 trang: Home, Login, ProductDetail...
│   │   ├── services/         # Tất cả lời gọi API (axios/fetch) đặt tại đây
│   │   ├── App.jsx           # Routing chính (<Routes>, <Route>)
│   │   └── main.jsx          # Entry point React
│   ├── .env                  # VITE_API_URL=http://localhost:5000
│   └── vite.config.js
└── .gitignore
```

---

## Quy ước quan trọng

### Backend

- **Mọi logic nghiệp vụ** nằm trong `controllers/`, không viết trực tiếp trong `routes/`
- **Route handler** chỉ gọi controller function, ví dụ:
  ```js
  // routes/productRoutes.js
  router.get('/', productController.getAllProducts);
  ```
- **Biến môi trường** đọc từ `.env` qua `process.env.TEN_BIEN`
- **Kết nối DB** được khởi tạo trong `config/db.js` và gọi trong `server.js`
- API prefix mặc định: `/api/...` (ví dụ `/api/products`, `/api/users`)

### Frontend

- **Gọi API** luôn qua file trong `services/`, không fetch trực tiếp trong component
  ```js
  // services/productService.js
  export const getProducts = () => axios.get(`${import.meta.env.VITE_API_URL}/api/products`);
  ```
- **Trang** (`pages/`) chứa logic lấy data và layout tổng thể
- **Component** (`components/`) là UI thuần, nhận props, không tự gọi API
- **Routing** cấu hình trong `App.jsx` dùng `react-router-dom`

---

## Khi AI được yêu cầu thêm tính năng

### Thêm 1 API mới (ví dụ: danh sách sản phẩm)

1. Tạo/cập nhật **Model** trong `backend/models/`
2. Tạo **Controller** trong `backend/controllers/`
3. Tạo **Route** trong `backend/routes/` và đăng ký vào `server.js`
4. Tạo **Service** trong `frontend/src/services/`
5. Dùng service trong **Page** hoặc **Component** tương ứng

### Thêm 1 trang mới (ví dụ: trang Giỏ hàng)

1. Tạo file `frontend/src/pages/Cart.jsx`
2. Thêm route trong `App.jsx`: `<Route path="/cart" element={<Cart />} />`
3. Thêm link trong `Navbar.jsx`

---

## Models hiện có

### User
```
_id, name, email, password, role (user/admin), createdAt
```

### Product
```
_id, name, brand, price, description, image, stock, category, createdAt
```

> ⚠️ Khi sửa Schema, cần kiểm tra lại các controller đang dùng field đó.

---

## Biến môi trường

### `backend/.env`
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/phone-store
```

### `frontend/.env`
```
VITE_API_URL=http://localhost:5000
```

> ⚠️ Biến Vite **bắt buộc** có tiền tố `VITE_` mới dùng được ở client.

---

## Chạy dự án

```bash
# Terminal 1 - Backend
cd backend
npm install
npm run dev   # hoặc node server.js

# Terminal 2 - Frontend
cd frontend
npm install
npm run dev
```

---

## Lưu ý cho AI

- Không tự ý thêm thư viện mới mà không đề xuất với người dùng trước
- Khi sửa backend, **không xóa** các route/controller cũ trừ khi được yêu cầu
- Luôn dùng `async/await` + `try/catch` cho các thao tác bất đồng bộ
- CORS đã được cấu hình ở `server.js` để cho phép frontend gọi API
- Ưu tiên dùng lại `components/` hiện có thay vì tạo mới khi không cần thiết
