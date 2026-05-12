# 📱 PHONESTORE PHASE 1 - HƯỚNG DẪN ĐẦY ĐỦ

**Ngày hoàn thành:** May 7, 2026  
**Giai đoạn:** Phase 1 - Backend Setup (JWT, Validation, Admin Check, CRUD)

---

## 🎯 PHASE 1 ĐÃ LÀM CÁI GÌ?

### ✅ 1. JWT Authentication (Xác thực người dùng)

**Vấn đề cũ:** Sau khi login, không có cách để xác nhận user là ai ở request tiếp theo.

**Giải pháp:** Dùng JWT Token
- User login thành công → server trả JWT token
- User lưu token vào localStorage
- Mỗi request, gửi token ở header: `Authorization: Bearer <token>`
- Server xác minh token → biết được ai là người dùng

**File:** `backend/middleware/auth.js`

```js
// Cách dùng:
const { protect, generateToken } = require('../middleware/auth');

// Trong route:
router.get('/profile/:id', protect, getUserProfile);
// protect middleware sẽ:
// 1. Kiểm tra header có "Authorization: Bearer <token>" không
// 2. Xác minh token (kiểm tra chữ ký)
// 3. Nếu valid → set req.user = decoded token
// 4. Nếu invalid → trả lỗi 401

// Trong controller (login):
const token = generateToken(user._id, user.role);
// Tạo JWT token, hết hạn sau 7 ngày
```

**Token có chứa:**
- `_id`: ID người dùng
- `role`: Vai trò (customer hoặc admin)
- `exp`: Thời gian hết hạn (7 ngày)

---

### ✅ 2. Input Validation (Kiểm tra dữ liệu)

**Vấn đề:** Người dùng có thể gửi email sai format, password quá ngắn, số điện thoại không hợp lệ...

**Giải pháp:** Validate trước khi xử lý

**File:** `backend/middleware/validation.js`

Các hàm validate:
- `validateRegister`: Kiểm tra fullname, email, password, phone
- `validateLogin`: Kiểm tra email, password
- `validateProduct`: Kiểm tra name, brand, price
- `validateReview`: Kiểm tra rating (1-5), comment
- `validateOrder`: Kiểm tra items, totalAmount, shippingAddress

**Cách dùng:**
```js
router.post('/register', validateRegister, registerUser);
// validateRegister sẽ chạy trước registerUser
// Nếu có lỗi → trả response 400 + message
// Nếu OK → gọi next() → registerUser chạy
```

**Ví dụ kiểm tra:**
```
Email: "abc@example.com" ✅ Hợp lệ
Email: "abc.example.com" ❌ Không có @ 
Email: "abc@.com" ❌ Không có domain

Phone: "0912345678" ✅ 10 chữ số
Phone: "091234567" ❌ Chỉ 9 chữ số

Password: "abc123" ✅ ≥ 6 ký tự
Password: "ab123" ❌ < 6 ký tự
```

---

### ✅ 3. Admin Middleware (Kiểm tra quyền)

**Vấn đề:** Người dùng bình thường có thể tạo/sửa/xóa sản phẩm → xáo trộn database.

**Giải pháp:** Kiểm tra role trước khi làm hành động admin

**File:** `backend/middleware/adminCheck.js`

**Cách dùng:**
```js
router.post('/products', protect, adminCheck, createProduct);
// 1. protect: Kiểm tra user đã login
// 2. adminCheck: Kiểm tra user.role === 'admin'
// 3. createProduct: Tạo sản phẩm
// Nếu không phải admin → trả lỗi 403 "Bạn không có quyền"
```

**Routes yêu cầu admin:**
- `POST /api/products` - Tạo sản phẩm
- `PUT /api/products/:id` - Sửa sản phẩm
- `DELETE /api/products/:id` - Xóa sản phẩm
- `PUT /api/orders/:id/status` - Cập nhật trạng thái đơn hàng
- `POST /api/categories` - Tạo danh mục

---

### ✅ 4. Error Handler (Xử lý lỗi)

**Vấn đề:** Mỗi route xử lý lỗi khác nhau → frontend khó parse response.

**Giải pháp:** Có middleware xử lý lỗi thống nhất

**File:** `backend/middleware/errorHandler.js`

**Response format thống nhất:**
```json
{
  "success": false,
  "message": "Email không hợp lệ",
  "statusCode": 400
}
```

**Các loại lỗi được xử lý:**
- Duplicate Key (Email đã tồn tại)
- Cast Error (ID không hợp lệ)
- Validation Error (Dữ liệu không hợp lệ)
- JWT Token Error (Token không hợp lệ)
- 404 Not Found (Route không tồn tại)

**Cách dùng:**
```js
// Trong server.js, đặt cuối cùng:
app.use(notFoundHandler);
app.use(errorHandler);

// Sau đó, trong route/controller, nếu lỗi → error sẽ được catch
```

---

### ✅ 5. Product CRUD (Tạo/Sửa/Xóa)

**Cũ:** Chỉ có GET products, GET product/:id, Search

**Mới:** Thêm create, update, delete

**File:** `backend/controllers/productController.js`

**Các endpoint mới:**
```
POST   /api/products       → Tạo sản phẩm (admin)
PUT    /api/products/:id   → Sửa sản phẩm (admin)
DELETE /api/products/:id   → Xóa sản phẩm (admin)
```

**Ví dụ tạo sản phẩm:**
```bash
curl -X POST http://localhost:5000/api/products \
  -H "Authorization: Bearer <JWT_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "iPhone 15 Pro",
    "brand": "Apple",
    "category": "507f1f77bcf86cd799439011",
    "price": 1200,
    "description": "Latest iPhone",
    "images": ["image1.jpg", "image2.jpg"],
    "specifications": {
      "screen": "6.1 inch",
      "chip": "A17 Pro",
      "battery": "3000mAh",
      "os": "iOS 17"
    },
    "variants": [
      {
        "color": "Black",
        "storage": "256GB",
        "price": 1200,
        "stock": 50,
        "sku": "IP15-BLACK-256"
      }
    ]
  }'
```

---

### ✅ 6. Updated Routes & Middleware Chaining

**Routes có middleware:**

```
User Routes:
  POST   /api/users/register      → validateRegister
  POST   /api/users/login         → validateLogin
  GET    /api/users/profile/:id   → protect

Product Routes:
  GET    /api/products            → (không yêu cầu token)
  GET    /api/products/:id        → (không yêu cầu token)
  GET    /api/products/search/:keyword → (không yêu cầu token)
  POST   /api/products            → protect, adminCheck, validateProduct
  PUT    /api/products/:id        → protect, adminCheck, validateProduct
  DELETE /api/products/:id        → protect, adminCheck

Category Routes:
  GET    /api/categories          → (không yêu cầu token)
  GET    /api/categories/:id      → (không yêu cầu token)
  POST   /api/categories          → protect, adminCheck

Order Routes:
  POST   /api/orders              → protect, validateOrder
  GET    /api/orders/:id          → protect
  GET    /api/orders/user/:userId → protect
  PUT    /api/orders/:id/status   → protect, adminCheck

Review Routes:
  POST   /api/reviews             → protect, validateReview
  GET    /api/reviews/product/:productId → (không yêu cầu token)
  DELETE /api/reviews/:id         → protect
```

---

## 📁 STRUCTURE THAY ĐỔI

Trước:
```
backend/
├── config/db.js
├── controllers/
├── models/
├── routes/
└── server.js
```

Sau:
```
backend/
├── middleware/              ← MỚI
│   ├── auth.js             ← JWT, generateToken
│   ├── validation.js       ← Kiểm tra input
│   ├── adminCheck.js       ← Kiểm tra quyền admin
│   └── errorHandler.js     ← Xử lý lỗi
├── config/db.js
├── controllers/
├── models/
├── routes/
└── server.js               ← CẬP NHẬT: Thêm error handler
```

---

## 🔧 CẤU HÌNH .ENV

**Bạn PHẢI tạo file `.env` trong `backend/` folder:**

```env
# Database
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/PhoneStoreDB?retryWrites=true&w=majority

# Server
PORT=5000
NODE_ENV=development

# JWT
JWT_SECRET=your-super-secret-key-change-this-in-production
```

**Lấy từ đâu:**
- `MONGO_URI`: Lấy từ MongoDB Atlas (trang bạn tạo database)
- `JWT_SECRET`: Tùy chọn (nhớ đổi ở production)

---

## 🧪 CÁCH TEST API

### Dùng Postman hoặc Thunder Client

#### 1. Test Register
```
POST http://localhost:5000/api/users/register
Content-Type: application/json

{
  "fullname": "Nguyễn Văn A",
  "email": "user@example.com",
  "password": "password123",
  "phone": "0912345678"
}

Response:
{
  "success": true,
  "token": "eyJhbGc...",
  "data": {
    "_id": "...",
    "fullname": "Nguyễn Văn A",
    "email": "user@example.com",
    "role": "customer"
  }
}
```

#### 2. Test Login
```
POST http://localhost:5000/api/users/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}

Response: (giống register, có token)
```

#### 3. Test Protected Route (Get Profile)
```
GET http://localhost:5000/api/users/profile/<USER_ID>
Headers:
  Authorization: Bearer <JWT_TOKEN_FROM_LOGIN>

Response:
{
  "success": true,
  "data": {
    "_id": "...",
    "fullname": "Nguyễn Văn A",
    "email": "user@example.com",
    ...
  }
}
```

#### 4. Test Create Product (Admin)
```
POST http://localhost:5000/api/products
Headers:
  Authorization: Bearer <ADMIN_TOKEN>
  Content-Type: application/json

{
  "name": "iPhone 15 Pro",
  "brand": "Apple",
  "price": 1200,
  "description": "Latest iPhone",
  "images": ["img1.jpg"],
  "specifications": {
    "screen": "6.1 inch",
    "chip": "A17 Pro"
  }
}

Response:
{
  "success": true,
  "data": { ... }
}
```

---

## 🚀 CHẠY SERVER

```bash
# 1. Vào folder backend
cd backend

# 2. Cài dependencies (nếu chưa cài)
npm install

# 3. Chạy development mode (tự restart khi có thay đổi)
npm run dev

# Hoặc chạy production mode
npm start
```

**Kết quả:**
```
Server started on port 5000
Mode: development
MongoDB Connected: ac-...-0.mongodb.net
Database: PhoneStoreDB
```

---

## ⚠️ QUAN TRỌNG - TRÁNH LỖI

### 1. Token không được gửi
❌ Lỗi: `401 Không tìm thấy token`
✅ Cách fix: Gửi header `Authorization: Bearer <token>`

### 2. Không phải admin
❌ Lỗi: `403 Bạn không có quyền`
✅ Cách fix: Dùng tài khoản admin hoặc cấp quyền

### 3. Token hết hạn
❌ Lỗi: `401 Token đã hết hạn`
✅ Cách fix: Login lại để lấy token mới

### 4. Route conflict (search/:keyword vs /:id)
❌ Lỗi: `/search/iPhone` match vào `/:id` chứ không phải `/search/:keyword`
✅ Cách fix: Đặt `/search/:keyword` trước `/products/:id`

### 5. Middleware không chạy
❌ Lỗi: Validation không hoạt động
✅ Cách fix: Đảm bảo thứ tự middleware là đúng
```js
// ✅ Đúng
router.post('/register', validateRegister, registerUser);

// ❌ Sai
router.post('/register', registerUser, validateRegister);
```

---

## 📊 API ENDPOINTS SUMMARY

### 👤 User Routes
| Method | URL | Auth | Mô tả |
|--------|-----|------|-------|
| POST | `/api/users/register` | ❌ | Đăng ký |
| POST | `/api/users/login` | ❌ | Đăng nhập |
| GET | `/api/users/profile/:id` | ✅ | Xem profile |

### 📱 Product Routes
| Method | URL | Auth | Admin | Mô tả |
|--------|-----|------|-------|-------|
| GET | `/api/products` | ❌ | ❌ | Danh sách |
| GET | `/api/products/:id` | ❌ | ❌ | Chi tiết |
| GET | `/api/products/search/:keyword` | ❌ | ❌ | Tìm kiếm |
| POST | `/api/products` | ✅ | ✅ | Tạo |
| PUT | `/api/products/:id` | ✅ | ✅ | Sửa |
| DELETE | `/api/products/:id` | ✅ | ✅ | Xóa |

### 📦 Order Routes
| Method | URL | Auth | Admin | Mô tả |
|--------|-----|------|-------|-------|
| POST | `/api/orders` | ✅ | ❌ | Tạo đơn |
| GET | `/api/orders/:id` | ✅ | ❌ | Chi tiết |
| GET | `/api/orders/user/:userId` | ✅ | ❌ | Lịch sử |
| PUT | `/api/orders/:id/status` | ✅ | ✅ | Cập nhật trạng thái |

### ⭐ Review Routes
| Method | URL | Auth | Mô tả |
|--------|-----|------|-------|
| POST | `/api/reviews` | ✅ | Tạo đánh giá |
| GET | `/api/reviews/product/:productId` | ❌ | Xem đánh giá |
| DELETE | `/api/reviews/:id` | ✅ | Xóa đánh giá |

### 🏷️ Category Routes
| Method | URL | Auth | Admin | Mô tả |
|--------|-----|------|-------|-------|
| GET | `/api/categories` | ❌ | ❌ | Danh sách |
| GET | `/api/categories/:id` | ❌ | ❌ | Chi tiết |
| POST | `/api/categories` | ✅ | ✅ | Tạo |

---

## 🎓 CÁCH MIDDLEWARE HOẠT ĐỘNG

```
Client gửi request
    ↓
Route nhận request
    ↓
Middleware 1 (validate) chạy
    ├─ Nếu lỗi → gửi response 400, không tiếp tục
    └─ Nếu OK → gọi next()
    ↓
Middleware 2 (protect) chạy
    ├─ Nếu không có token → gửi 401, không tiếp tục
    └─ Nếu token OK → set req.user, gọi next()
    ↓
Middleware 3 (adminCheck) chạy
    ├─ Nếu không admin → gửi 403, không tiếp tục
    └─ Nếu admin → gọi next()
    ↓
Controller (hàm xử lý) chạy
    ├─ Xử lý logic
    └─ Gửi response
    ↓
Error Handler bắt lỗi (nếu có)
    └─ Gửi response lỗi thống nhất
```

---

## 🔐 JWT TOKEN FLOW

```
1. User nhập email + password
2. Frontend gửi: POST /api/users/login {email, password}
3. Backend:
   - Kiểm tra email tồn tại
   - Kiểm tra password đúng
   - Tạo JWT: generateToken(user._id, user.role)
   - Trả token về: { token: "eyJhbGc..." }
4. Frontend:
   - Lưu token vào localStorage
   - Sau này mỗi request, gửi: Authorization: Bearer <token>
5. Backend:
   - Middleware protect() kiểm tra token
   - jwt.verify(token) → nếu valid, lấy ra user info
   - set req.user = {_id, role}
   - Controller dùng req.user để biết ai là user
6. Token hết hạn sau 7 ngày:
   - Frontend nhận lỗi 401 → redirect login
   - User login lại → lấy token mới
```

---

## 📝 LƯU Ý THÊM

1. **Populate:** Khi lấy product, category name được kéo vào (populate)
2. **Exclude password:** Khi trả user info, không trả password
3. **Validate trước:** Kiểm tra dữ liệu trước khi vào database
4. **Error thống nhất:** Tất cả error có format giống nhau
5. **Admin check:** Cần có JWT + role admin

---

## 🎯 TIẾP THEO (PHASE 2)

Sau khi Phase 1 xong, tiếp tục với **Frontend**:
1. Tạo React components
2. Tạo services gọi API này
3. Tạo pages (Home, Login, ProductList, etc.)
4. Tạo state management (Auth, Cart)

---

**Hết Phase 1! 🎉 Backend đã sẵn sàng cho Frontend.**
