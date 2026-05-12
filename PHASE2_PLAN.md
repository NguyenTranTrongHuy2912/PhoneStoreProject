# 📱 **PHASE 2 - FRONTEND IMPLEMENTATION PLAN**

**Ngày bắt đầu:** May 9, 2026  
**Backend Status:** ✅ Hoàn thành Phase 1 (JWT, Validation, Admin Check, CRUD)  
**Frontend Status:** 🚀 Bắt đầu Phase 2

---

## 🎯 **TỔNG QUAN**

Phase 2 sẽ xây dựng **Full-stack Frontend** với:
- **React 19** + **Vite** (hiện tại) → Có thể upgrade **Next.js 15** sau
- **TypeScript** (bắt buộc)
- **Zustand** (State Management)
- **React Query** (Data Fetching)
- **React Hook Form + Zod** (Form Validation)
- **Tailwind CSS** (UI)
- **Jest + React Testing Library** (Testing)

---

## 📊 **TECH STACK (PHASE 2)**

```
Frontend:
├── Framework: React 19 + Vite (hoặc Next.js 15)
├── Language: TypeScript
├── State: Zustand (lightweight, không boilerplate)
├── API: React Query (data fetching + caching)
├── Forms: React Hook Form + Zod
├── UI: Tailwind CSS + React Icons
├── Auth: Custom JWT + Context API
├── Testing: Jest + React Testing Library + Vitest
└── Build: Vite / Next.js

Backend (Existing):
├── API: Express.js + Node.js ✅
├── Auth: JWT ✅
├── Database: MongoDB Atlas ✅
└── Middleware: Validation + Admin Check ✅
```

---

## 📁 **FOLDER STRUCTURE (NEW)**

```
frontend/
├── public/
│   ├── images/
│   └── icons/
├── src/
│   ├── components/           ← UI Components (tách lớp)
│   │   ├── common/
│   │   │   ├── Navbar.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── Layout.tsx
│   │   │   └── LoadingSpinner.tsx
│   │   ├── auth/
│   │   │   ├── LoginForm.tsx
│   │   │   ├── RegisterForm.tsx
│   │   │   └── ProtectedRoute.tsx
│   │   ├── products/
│   │   │   ├── ProductCard.tsx
│   │   │   ├── ProductGrid.tsx
│   │   │   ├── FilterSidebar.tsx
│   │   │   └── SearchBar.tsx
│   │   ├── cart/
│   │   │   ├── CartItem.tsx
│   │   │   ├── CartSummary.tsx
│   │   │   └── EmptyCart.tsx
│   │   ├── admin/
│   │   │   ├── AdminNav.tsx
│   │   │   ├── ProductTable.tsx
│   │   │   ├── OrderTable.tsx
│   │   │   ├── UserTable.tsx
│   │   │   └── Dashboard.tsx
│   │   └── forms/
│   │       ├── ProductForm.tsx
│   │       ├── UserForm.tsx
│   │       └── ImageUpload.tsx
│   │
│   ├── pages/               ← Page Components (routing)
│   │   ├── HomePage.tsx
│   │   ├── LoginPage.tsx
│   │   ├── RegisterPage.tsx
│   │   ├── ProductListPage.tsx
│   │   ├── ProductDetailPage.tsx
│   │   ├── CartPage.tsx
│   │   ├── CheckoutPage.tsx
│   │   ├── OrderHistoryPage.tsx
│   │   ├── OrderDetailPage.tsx
│   │   ├── ProfilePage.tsx
│   │   ├── admin/
│   │   │   ├── AdminDashboard.tsx
│   │   │   ├── AdminProducts.tsx
│   │   │   ├── AdminOrders.tsx
│   │   │   ├── AdminUsers.tsx
│   │   │   └── AdminStats.tsx
│   │   └── NotFoundPage.tsx
│   │
│   ├── hooks/               ← Custom Hooks
│   │   ├── useAuth.ts
│   │   ├── useFetch.ts
│   │   ├── useCart.ts
│   │   ├── useDebounce.ts
│   │   ├── useLocalStorage.ts
│   │   ├── useMutate.ts
│   │   └── useForm.ts
│   │
│   ├── services/            ← API Services (gọi backend)
│   │   ├── api.ts           (axios setup + interceptors)
│   │   ├── authService.ts
│   │   ├── productService.ts
│   │   ├── orderService.ts
│   │   ├── reviewService.ts
│   │   ├── userService.ts
│   │   └── uploadService.ts
│   │
│   ├── store/               ← State Management (Zustand)
│   │   ├── authStore.ts
│   │   ├── cartStore.ts
│   │   ├── filterStore.ts
│   │   └── notificationStore.ts
│   │
│   ├── types/               ← TypeScript Types
│   │   ├── auth.ts
│   │   ├── product.ts
│   │   ├── order.ts
│   │   ├── user.ts
│   │   ├── api.ts
│   │   └── index.ts
│   │
│   ├── utils/               ← Utility Functions
│   │   ├── validators.ts
│   │   ├── formatters.ts
│   │   ├── constants.ts
│   │   ├── cn.ts            (classname util)
│   │   └── axios-setup.ts
│   │
│   ├── contexts/            ← React Context (nếu cần)
│   │   └── NotificationContext.tsx
│   │
│   ├── lib/                 ← 3rd party config
│   │   ├── queryClient.ts
│   │   └── zod-schemas.ts
│   │
│   ├── App.tsx              ← Router + Layout
│   ├── main.tsx             ← Entry point
│   ├── index.css            ← Global styles
│   └── App.css
│
├── tests/                   ← Tests
│   ├── unit/
│   ├── integration/
│   └── __mocks__/
│
├── .env.example
├── .eslintrc.cjs
├── .prettierrc
├── .gitignore
├── vite.config.ts
├── vitest.config.ts
├── tsconfig.json
├── tailwind.config.js
├── package.json
└── README.md
```

---

## 📦 **PACKAGES CẦN CÀI ĐẶT**

```bash
# Core
npm install react react-dom react-router-dom

# State Management
npm install zustand

# Data Fetching
npm install @tanstack/react-query axios

# Forms
npm install react-hook-form zod @hookform/resolvers

# UI
npm install react-icons lucide-react

# Utils
npm install classnames dayjs clsx

# Dev Tools
npm install -D typescript vite @vitejs/plugin-react
npm install -D tailwindcss postcss autoprefixer
npm install -D eslint @typescript-eslint/eslint-plugin
npm install -D prettier husky lint-staged

# Testing
npm install -D vitest @testing-library/react @testing-library/jest-dom
npm install -D @vitest/ui
```

---

## 🔑 **KEY FEATURES - MVP (BẮTBUỘC)**

### ✅ **1. Authentication & Authorization**
- [x] Đăng ký (Register) + Email validation
- [x] Đăng nhập (Login) + JWT token
- [x] Đăng xuất (Logout)
- [x] Protected Routes (phải login)
- [x] Admin Routes (phải admin)
- [x] Refresh Token (auto-refresh)
- [x] Remember Me (localStorage)
- [x] Forgot Password (optional)

### ✅ **2. Product Management**
- [x] Danh sách sản phẩm
- [x] Chi tiết sản phẩm
- [x] Tìm kiếm (search)
- [x] Lọc (filter theo danh mục, thương hiệu, giá)
- [x] Phân trang (pagination)
- [x] Đánh giá & bình luận (reviews)
- [x] Admin: Tạo/Sửa/Xóa sản phẩm
- [x] Admin: Upload ảnh sản phẩm

### ✅ **3. Shopping Cart**
- [x] Thêm sản phẩm vào giỏ
- [x] Xóa sản phẩm khỏi giỏ
- [x] Thay đổi số lượng
- [x] Tính tổng tiền tự động
- [x] Lưu giỏ vào localStorage
- [x] Persisted across page reload

### ✅ **4. Orders & Checkout**
- [x] Tạo đơn hàng
- [x] Chọn địa chỉ giao hàng
- [x] Chọn phương thức thanh toán
- [x] Xác nhận đơn hàng
- [x] Trang thành công
- [x] Lịch sử đơn hàng
- [x] Chi tiết đơn hàng
- [x] Cập nhật trạng thái đơn (admin)
- [x] Hủy đơn hàng

### ✅ **5. User Profile**
- [x] Xem thông tin cá nhân
- [x] Cập nhật profile
- [x] Đổi mật khẩu
- [x] Upload avatar
- [x] Quản lý địa chỉ
- [x] Xem lịch sử đơn hàng

### ✅ **6. Admin Dashboard**
- [x] Thống kê tổng quan (doanh thu, đơn hàng)
- [x] Biểu đồ doanh thu theo ngày/tuần/tháng
- [x] Bảng đơn hàng (danh sách + filter)
- [x] Bảng sản phẩm (CRUD)
- [x] Bảng người dùng (danh sách)
- [x] Export dữ liệu (CSV/PDF)

### ✅ **7. Image Upload**
- [x] Upload ảnh đơn (avatar)
- [x] Upload ảnh đa (sản phẩm)
- [x] Preview trước khi upload
- [x] Validate type (jpg, png, webp)
- [x] Validate size (max 5MB)
- [x] Progress bar
- [x] Error handling

### ✅ **8. Search & Filter & Pagination**
- [x] Tìm kiếm theo tên sản phẩm
- [x] Lọc theo danh mục
- [x] Lọc theo thương hiệu
- [x] Lọc theo giá (price range)
- [x] Lọc theo rating
- [x] Phân trang (page/limit)
- [x] Lưu filter state ở URL query params
- [x] Debounced search (avoid too many requests)

### ✅ **9. Notifications & Error Handling**
- [x] Toast notifications (success/error/warning)
- [x] Loading states
- [x] Error messages (form validation)
- [x] Empty states
- [x] 404 Not Found page
- [x] Global error boundary

---

## 🏗️ **IMPLEMENTATION LAYERS**

### **Layer 1: UI Components (Pure, Reusable)**
```tsx
// components/products/ProductCard.tsx
- Props: product, onAddCart, onDetail
- No API calls
- No business logic
- Just UI + callbacks
```

### **Layer 2: Container Components (Logic)**
```tsx
// components/products/ProductGrid.tsx
- Fetch data via React Query
- Handle loading/error states
- Render ProductCard children
```

### **Layer 3: Page Components (Routing)**
```tsx
// pages/ProductListPage.tsx
- Use containers + components
- Handle routing params
- Page-level state
```

---

## 🔄 **DATA FLOW**

```
Page Component
    ↓
Container Component (React Query)
    ↓
Service (API call)
    ↓
Backend API
    ↓
Database (MongoDB)
    ↓
Zustand Store (if needed)
    ↓
UI Components (Props)
```

---

## 🔐 **AUTH FLOW**

```
1. User Submit Login Form
    ↓
2. authService.login(email, password)
    ↓
3. Backend returns JWT token
    ↓
4. Store in Zustand + localStorage
    ↓
5. Set Auth header in axios
    ↓
6. Redirect to dashboard/home
    ↓
7. Protected routes check token
    ↓
8. If expired → refreshToken()
    ↓
9. If invalid → logout + redirect login
```

---

## 🎨 **UI/UX REQUIREMENTS**

### **Responsive Design**
- Mobile: 320px - 640px
- Tablet: 641px - 1024px
- Desktop: 1025px+

### **Color Scheme**
- Primary: Blue/Indigo
- Secondary: Gray
- Success: Green
- Error: Red
- Warning: Yellow

### **Components**
- Header/Navbar
- Footer
- Sidebar (Admin)
- Cards (Product, Order)
- Forms (Login, Checkout, Product)
- Tables (Orders, Users, Products)
- Modals (Confirm, Image Preview)
- Alerts (Toast, Dialog)

---

## 📝 **VALIDATION SCHEMAS (Zod)**

```typescript
// User
- Name: min 3, max 50
- Email: valid email format
- Password: min 6, has uppercase/number
- Phone: 10 digits

// Product
- Name: min 3, max 100
- Price: > 0
- Stock: >= 0
- Images: min 1

// Order
- Items: not empty
- TotalAmount: > 0
- ShippingAddress: not empty
- PaymentMethod: valid option

// Review
- Rating: 1-5 stars
- Comment: min 5 characters
```

---

## 🧪 **TESTING STRATEGY**

### **Unit Tests**
- Utils functions
- Validators
- Formatters
- Hooks (useAuth, useCart)

### **Integration Tests**
- Login flow
- Product search + filter
- Add to cart + checkout
- Create review

### **E2E Tests (Optional)**
- Complete user journey
- Admin dashboard flow
- Error scenarios

---

## 🚀 **DEPLOYMENT & CI/CD**

### **Deployment Targets**
- Primary: Vercel (recommended for Vite/Next)
- Alternative: Netlify, Render

### **CI/CD Pipeline**
- Run lint on PR
- Run tests on PR
- Build check before merge
- Auto deploy on main merge

### **Environment Variables**
```
VITE_API_URL=http://localhost:5000
VITE_API_TIMEOUT=10000
VITE_UPLOAD_SIZE_LIMIT=5242880
```

---

## 📚 **DOCUMENTATION**

1. **README.md**
   - Setup hướng dẫn
   - Available scripts
   - API endpoints list
   - Demo accounts

2. **docs/ARCHITECTURE.md**
   - Tech stack
   - Folder structure
   - Data flow diagram

3. **docs/CONTRIBUTING.md**
   - Git workflow
   - Coding standards
   - PR template

4. **docs/API.md**
   - Backend API reference
   - Example requests/responses

5. **docs/COMPONENTS.md**
   - Component library
   - Props reference
   - Usage examples

---

## ⏱️ **TIMELINE ESTIMATE**

| Phase | Tasks | Estimate |
|-------|-------|----------|
| **1** | Setup + Packages + Config | 1 day |
| **2** | Core Components + Layout | 2 days |
| **3** | Auth System + Protected Routes | 1.5 days |
| **4** | Products (List, Detail, Search, Filter) | 2 days |
| **5** | Cart + Checkout | 1.5 days |
| **6** | Orders + Order History | 1.5 days |
| **7** | Admin Dashboard | 2 days |
| **8** | Upload + Image Optimization | 1 day |
| **9** | Forms + Validation | 1.5 days |
| **10** | Testing + Polishing | 2 days |
| **11** | Deploy + Documentation | 1 day |
| **TOTAL** | | **~17 days** |

---

## ✅ **QUALITY CHECKLIST**

- [ ] All routes implemented
- [ ] All forms validated
- [ ] Loading states on all API calls
- [ ] Error handling on all API calls
- [ ] Empty states for empty lists
- [ ] 404 page for invalid routes
- [ ] Auth tokens persisted
- [ ] Cart persisted to localStorage
- [ ] Images optimized
- [ ] Lighthouse score > 90
- [ ] Mobile responsive
- [ ] Accessibility (a11y) tested
- [ ] TypeScript no-errors
- [ ] All tests passing
- [ ] README complete
- [ ] .env.example created

---

## 🎯 **NEXT STEPS**

1. ✅ Create this plan document
2. ⏳ Install all packages
3. ⏳ Setup TypeScript + Tailwind + Zustand
4. ⏳ Create folder structure
5. ⏳ Create types/interfaces
6. ⏳ Setup API service + interceptors
7. ⏳ Create Zustand stores
8. ⏳ Create custom hooks
9. ⏳ Build core components
10. ⏳ Build all pages
11. ⏳ Create tests
12. ⏳ Deploy

---

**Let's go! 🚀**
