# 🧪 TESTING PHASE 1 - API ENDPOINTS

## ✅ Server Status
```
Server started on port 5000
Mode: development
MongoDB Connected: ✅
```

---

## 📌 HƯỚNG DẪN TEST API

Để test các API, dùng **Postman**, **Thunder Client**, hoặc **CURL**.

### 💡 TIP: Download Thunder Client (VS Code Extension)
- Mở VS Code
- Extension Marketplace → Tìm "Thunder Client"
- Cài đặt
- Nhấn icon Thunder Client bên trái
- Create Request → Chọn method + nhập URL

---

## 🚀 TEST TỪNG ENDPOINT

### 1️⃣ **Test Health Check**
```
GET http://localhost:5000/

Expected Response:
"API PhoneStoreProject đang chạy mượt mà..."

✅ Status: 200
```

---

### 2️⃣ **Test Register (Tạo tài khoản mới)**

**Method:** POST  
**URL:** http://localhost:5000/api/users/register

**Headers:**
```
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "fullname": "Nguyễn Trọng Huy",
  "email": "huy@example.com",
  "password": "password123",
  "phone": "0912345678"
}
```

**Expected Response (200):**
```json
{
  "success": true,
  "message": "Đăng ký thành công",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "fullname": "Nguyễn Trọng Huy",
    "email": "huy@example.com",
    "role": "customer"
  }
}
```

**❌ Lỗi có thể:**
- Email đã tồn tại → 400 "Email đã được sử dụng"
- Email không hợp lệ (thiếu @) → 400 "Email không hợp lệ"
- Password < 6 ký tự → 400 "Mật khẩu phải từ 6 ký tự trở lên"
- Phone không 10 chữ → 400 "Số điện thoại phải là 10 chữ số"

**💾 Lưu token để dùng cho các request tiếp theo**

---

### 3️⃣ **Test Login (Đăng nhập)**

**Method:** POST  
**URL:** http://localhost:5000/api/users/login

**Body:**
```json
{
  "email": "huy@example.com",
  "password": "password123"
}
```

**Expected Response (200):**
```json
{
  "success": true,
  "message": "Đăng nhập thành công",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "fullname": "Nguyễn Trọng Huy",
    "email": "huy@example.com",
    "role": "customer"
  }
}
```

**❌ Lỗi có thể:**
- Email sai → 401 "Email hoặc mật khẩu không đúng"
- Password sai → 401 "Email hoặc mật khẩu không đúng"

---

### 4️⃣ **Test Get Profile (Lấy profile người dùng)**

**Method:** GET  
**URL:** http://localhost:5000/api/users/profile/[USER_ID]

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Thay `eyJhbGci...` bằng token từ login**

**Expected Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "fullname": "Nguyễn Trọng Huy",
    "email": "huy@example.com",
    "phone": "0912345678",
    "addresses": [],
    "role": "customer",
    "createdAt": "2026-05-07T...",
    "updatedAt": "2026-05-07T..."
  }
}
```

**❌ Lỗi có thể:**
- Không gửi token → 401 "Không tìm thấy token"
- Token sai → 401 "Token không hợp lệ"
- User ID sai → 500 "ID không hợp lệ"

---

### 5️⃣ **Test Get All Products**

**Method:** GET  
**URL:** http://localhost:5000/api/products

**Headers:** Không cần (public route)

**Expected Response (200):**
```json
{
  "success": true,
  "count": 0,
  "data": []
}
```

(Trống vì chưa tạo sản phẩm)

---

### 6️⃣ **Test Get Categories**

**Method:** GET  
**URL:** http://localhost:5000/api/categories

**Expected Response (200):**
```json
{
  "success": true,
  "count": 0,
  "data": []
}
```

---

### 7️⃣ **Test Create Category (Admin)**

**CẢNH BÁO:** Chỉ admin mới được tạo category!

Đầu tiên, phải có tài khoản admin. Có 2 cách:

**Cách 1: Tạo admin qua MongoDB Atlas**
1. Vào MongoDB Atlas → PhoneStoreDB
2. Collections → Users
3. Insert một document:
```json
{
  "fullname": "Admin",
  "email": "admin@example.com",
  "password": "$2b$10$...(mã hóa của 'admin123')",
  "phone": "0912345679",
  "role": "admin",
  "addresses": [],
  "createdAt": new Date(),
  "updatedAt": new Date()
}
```

Hoặc **Cách 2: Update user hiện tại** (dùng MongoDB tool)

---

### 8️⃣ **Test Search Products**

**Method:** GET  
**URL:** http://localhost:5000/api/products/search/iphone

**Expected Response:**
```json
{
  "success": true,
  "count": 0,
  "data": []
}
```

(Trống vì chưa có sản phẩm có tên "iphone")

---

## 📊 TEST CHECKLIST

Dùng checklist này để xác nhận mọi tính năng hoạt động:

### ✅ User Authentication
- [ ] Register thành công, trả token
- [ ] Login thành công, trả token
- [ ] Get Profile cần token
- [ ] Get Profile lỗi 401 nếu không có token
- [ ] Register lỗi nếu email sai format
- [ ] Register lỗi nếu password < 6 ký tự
- [ ] Register lỗi nếu phone không 10 chữ

### ✅ Product Management
- [ ] Get all products (public)
- [ ] Get product by ID (public)
- [ ] Search products (public)
- [ ] Create product cần admin (sẽ test sau)
- [ ] Update product cần admin
- [ ] Delete product cần admin

### ✅ Category Management
- [ ] Get all categories (public)
- [ ] Get category by ID (public)
- [ ] Create category cần admin

### ✅ Order Management
- [ ] Create order cần token
- [ ] Get user orders cần token
- [ ] Get order by ID cần token
- [ ] Update order status cần admin

### ✅ Review Management
- [ ] Create review cần token
- [ ] Get product reviews (public)
- [ ] Delete review cần token

### ✅ Error Handling
- [ ] 400 Bad Request khi validate fail
- [ ] 401 Unauthorized khi thiếu token
- [ ] 403 Forbidden khi không phải admin
- [ ] 404 Not Found khi resource không tồn tại
- [ ] 500 Server Error khi lỗi logic

---

## 🔧 TROUBLESHOOTING

### ❌ "Token không hợp lệ"
**Nguyên nhân:** Token sai hoặc hết hạn  
**Cách fix:** Login lại để lấy token mới

### ❌ "Bạn không có quyền"
**Nguyên nhân:** Không phải admin  
**Cách fix:** Dùng tài khoản admin, hoặc update user.role trong MongoDB

### ❌ "Email đã được sử dụng"
**Nguyên nhân:** Email này đã register rồi  
**Cách fix:** Dùng email khác, hoặc xóa user cũ trong MongoDB

### ❌ "Số điện thoại phải là 10 chữ số"
**Nguyên nhân:** Format phone sai  
**Cách fix:** Phone phải đúng 10 chữ số: 0912345678

### ❌ Server không start
**Nguyên nhân:** Thiếu .env hoặc MongoDB URI sai  
**Cách fix:** 
1. Tạo file `.env` trong backend/
2. Copy MongoDB URI từ Atlas
3. Restart server

---

## 📝 CÁC BIẾN TRONG .ENV

**Backend cần:**
```env
MONGO_URI=mongodb+srv://...
PORT=5000
NODE_ENV=development
JWT_SECRET=your-secret-key
```

---

## 🎯 TEST ORDER

**Đề xuất test theo thứ tự:**
1. Register user → lấy token
2. Get Profile → xác nhận token hoạt động
3. Create Category (admin) → tạo danh mục
4. Create Product (admin) → tạo sản phẩm
5. Get Products → xem sản phẩm vừa tạo
6. Create Order (user) → tạo đơn hàng
7. Get Orders (user) → xem lịch sử đơn
8. Create Review → gửi đánh giá
9. Get Reviews → xem đánh giá
10. Update Order Status (admin) → cập nhật trạng thái

---

## 💡 QUICK TEST SCRIPT (CURL)

```bash
# 1. Register
curl -X POST http://localhost:5000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{"fullname":"Huy","email":"huy@test.com","password":"123456","phone":"0912345678"}'

# 2. Login
curl -X POST http://localhost:5000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"huy@test.com","password":"123456"}'

# 3. Get Profile (thay TOKEN)
curl -X GET http://localhost:5000/api/users/profile/[USER_ID] \
  -H "Authorization: Bearer [TOKEN]"

# 4. Get Products
curl -X GET http://localhost:5000/api/products
```

---

## ✨ KỲ VỌNG CÓ ĐƯỢC

Sau Phase 1:
- ✅ JWT Authentication hoạt động
- ✅ Validation input hoạt động
- ✅ Admin check hoạt động
- ✅ Error handler hoạt động
- ✅ Product CRUD hoạt động
- ✅ Tất cả routes bảo vệ bằng middleware

---

**Bây giờ backend đã sẵn sàng! 🎉**

Tiếp theo: Phase 2 - Frontend
