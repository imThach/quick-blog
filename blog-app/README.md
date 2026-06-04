# 🚀 Frontend Challenge - Blog Application

## 📋 Tổng quan

Xây dựng một ứng dụng **Blog** hoàn chỉnh sử dụng React, kết nối với REST API có sẵn. Ứng dụng bao gồm các chức năng: xem bài viết, đăng nhập/đăng ký, tạo bài viết, quản lý bài viết cá nhân, và quản lý người dùng (admin).

Codebase hiện tại là **example tham khảo** về chức năng và cấu trúc project. Bạn cần tự xây dựng lại từ đầu dựa trên yêu cầu bên dưới.

---

## 🛠️ Tech Stack yêu cầu

| Công nghệ | Mục đích |
| --- | --- |
| React 19 | UI Library |
| Vite | Build tool |
| React Router DOM v7 | Routing |
| Axios | HTTP Client |
| TailwindCSS v4 | Styling |
| Radix UI / shadcn | UI Components |
| React Hot Toast | Notifications |
| TinyMCE hoặc tương đương | Rich text editor |
| Cloudinary | Upload ảnh |
| Lottie React | Animation (optional) |

---

## 📁 Cấu trúc thư mục yêu cầu

```
src/
├── assets/                    # Ảnh, SVG, animation files
├── components/
│   ├── ui/                    # Reusable UI components (Button, Input, Card, Dialog, Table...)
│   ├── context/               # React Context (AuthContext)
│   ├── services/
│   │   └── api/               # Axios instance + API functions
│   ├── Layout/                # Layout chung (Header + Outlet + Footer)
│   ├── Header/                # Navigation bar
│   ├── Footer/                # Footer
│   ├── ProtectedRoute/        # Route guard theo role
│   ├── CardBlog/              # Card hiển thị blog trên trang chủ
│   ├── BlogPostDetail/        # Component hiển thị chi tiết bài viết
│   ├── CloudinaryUpload/      # Component upload ảnh
│   ├── DialogConfirm/         # Dialog xác nhận xóa
│   └── DialogChangeRole/      # Dialog đổi role user
├── hooks/
│   └── useAuthorization/      # Custom hook kiểm tra quyền
├── pages/
│   ├── Home/                  # Trang chủ - danh sách blog
│   ├── Login/                 # Trang đăng nhập
│   ├── SignUp/                # Trang đăng ký
│   ├── CreateBlog/            # Trang tạo blog mới
│   ├── BlogDetails/           # Trang chi tiết blog
│   ├── MyPost/                # Trang quản lý bài viết cá nhân
│   └── UserManagement/        # Trang quản lý user (admin only)
├── utils/                     # Utility functions
├── lib/                       # Helper (cn, clsx...)
├── App.jsx                    # Router config
├── main.jsx                   # Entry point
└── index.css                  # Global styles + Tailwind
```

---

## 🔌 API Endpoints

Base URL được cấu hình qua biến môi trường `VITE_API_URL`.

### Authentication

| Method | Endpoint | Mô tả | Auth |
| --- | --- | --- | --- |
| POST | `/auth/login` | Đăng nhập | ❌ |
| POST | `/auth/register` | Đăng ký | ❌ |
| GET | `/auth/me` | Lấy thông tin user hiện tại | ✅ Bearer Token |

### Blog Posts

| Method | Endpoint | Mô tả | Auth |
| --- | --- | --- | --- |
| GET | `/posts` | Lấy tất cả bài viết | ❌ |
| GET | `/posts/:id` | Lấy chi tiết bài viết | ❌ |
| GET | `/posts?userId=:id` | Lấy bài viết theo user | ✅ |
| POST | `/posts` | Tạo bài viết mới | ✅ |
| DELETE | `/posts/:id` | Xóa bài viết | ✅ |

### Users (Admin)

| Method | Endpoint | Mô tả | Auth |
| --- | --- | --- | --- |
| GET | `/users` | Lấy danh sách users | ✅ Admin |
| DELETE | `/users/:id` | Xóa user | ✅ Admin |
| PUT | `/users/:id/role` | Đổi role user | ✅ Admin |

### Response format

```json
// Login response
{
  "accessToken": "jwt_token_here",
  "user": {
    "id": "...",
    "email": "...",
    "username": "...",
    "role": "user" | "admin"
  }
}

// Get all posts response
{
  "items": [
    {
      "_id": "...",
      "title": "...",
      "content": "<html content>",
      "image": "https://...",
      "tags": ["tag1", "tag2"],
      "author": {
        "_id": "...",
        "username": "..."
      },
      "createdAt": "2025-01-01T00:00:00.000Z"
    }
  ]
}

// Create post body
{
  "title": "...",
  "content": "...",
  "tags": ["...", "..."],
  "image": "https://cloudinary_url"
}
```

---

## ✅ Yêu cầu chức năng

### Level 1: Cơ bản (Bắt buộc)

### 1.1 Setup Project

- [ ]  Khởi tạo project Vite + React
- [ ]  Cấu hình TailwindCSS v4
- [ ]  Cấu hình path alias (`@/` → `src/`)
- [ ]  Setup Axios instance với interceptors (gắn token, xử lý 401)
- [ ]  Tạo file `.env` với `VITE_API_URL`

### 1.2 Authentication

- [ ]  Trang **Login** với form email + password
- [ ]  Trang **Sign Up** với form email + username + password
- [ ]  Lưu thông tin user (accessToken, user info) vào `localStorage`
- [ ]  Tạo `AuthContext` để quản lý state auth toàn app
- [ ]  Hiển thị loading state khi đang xử lý login/register
- [ ]  Hiển thị toast thông báo thành công/thất bại
- [ ]  Redirect về trang chủ sau khi login/register thành công

### 1.3 Layout & Navigation

- [ ]  Layout chung: Header + Content (Outlet) + Footer
- [ ]  Header hiển thị logo, nút Create Blog, nút User menu
- [ ]  User menu (Popover):
    - Chưa đăng nhập: hiển thị Login, Sign Up
    - Đã đăng nhập: hiển thị My Posts, Logout
    - Admin: thêm mục User Management
- [ ]  Responsive design (mobile-friendly)

### 1.4 Trang chủ (Home)

- [ ]  Hiển thị danh sách blog dạng grid cards
- [ ]  Mỗi card gồm: ảnh thumbnail, tags, title, nội dung rút gọn
- [ ]  Click card → chuyển đến trang chi tiết
- [ ]  Loading skeleton khi đang fetch data
- [ ]  Hiển thị thông báo khi không có blog nào

### 1.5 Chi tiết Blog

- [ ]  Hiển thị đầy đủ: ngày đăng, tiêu đề, tên tác giả, ảnh, nội dung HTML
- [ ]  Render nội dung HTML an toàn (dangerouslySetInnerHTML)
- [ ]  Loading spinner khi đang fetch

---

### Level 2: Nâng cao (Bắt buộc)

### 2.1 Protected Routes

- [ ]  Component `ProtectedRoute` nhận prop `roles` (mảng role được phép)
- [ ]  Chưa đăng nhập → redirect `/login`
- [ ]  Không đủ quyền → redirect `/`
- [ ]  Xử lý loading state (tránh flash redirect)

### 2.2 Tạo Blog

- [ ]  Upload ảnh thumbnail lên Cloudinary
- [ ]  Input tiêu đề
- [ ]  Rich text editor cho nội dung (TinyMCE)
- [ ]  Thêm/xóa tags (nhấn Enter hoặc nút Add)
- [ ]  Validate: tất cả fields phải có giá trị
- [ ]  Loading state khi đang tạo
- [ ]  Redirect về trang chủ sau khi tạo thành công

### 2.3 Quản lý bài viết (My Posts)

- [ ]  Hiển thị bài viết của user hiện tại dạng table
- [ ]  Cột: Title, Content (rút gọn), Action
- [ ]  Action: Xem chi tiết, Xóa
- [ ]  Dialog xác nhận trước khi xóa
- [ ]  Admin thấy tất cả bài viết

### 2.4 Tìm kiếm Blog

- [ ]  Input search trên trang chủ
- [ ]  Filter blog theo title (client-side)
- [ ]  Hiển thị thông báo khi không tìm thấy kết quả

---

### Level 3: Admin (Bắt buộc cho role admin)

### 3.1 Quản lý User

- [ ]  Hiển thị danh sách user dạng table
- [ ]  Cột: Username, Email, Role (badge), Action
- [ ]  Action: Xóa user, Đổi role
- [ ]  Dialog xác nhận xóa
- [ ]  Dialog đổi role (select dropdown)
- [ ]  Chỉ admin mới truy cập được

---

### Level 4: Bonus (Không bắt buộc)

- [ ]  Dark mode toggle (lưu preference vào localStorage)
- [ ]  Animation với Lottie cho empty states
- [ ]  Skeleton loading thay vì spinner đơn giản
- [ ]  Responsive hoàn chỉnh trên mọi breakpoint
- [ ]  Xử lý edge cases: token hết hạn, network error, empty states
- [ ]  Pagination cho danh sách blog
- [ ]  Edit blog post
- [ ]  Comment system
- [ ]  Like/Bookmark blog

---

## 🔐 Biến môi trường (.env)

```
VITE_API_URL=<backend_api_url>
VITE_TINY_MCE_API_KEY=<tinymce_api_key>
VITE_CLOUDINARY_CLOUD_NAME=<cloudinary_cloud_name>
VITE_CLOUDINARY_UPLOAD_PRESET=<cloudinary_upload_preset>
```

---

## 📐 Tiêu chí đánh giá

| Tiêu chí | Trọng số |
| --- | --- |
| Hoàn thành chức năng (Level 1-3) | 40% |
| Code structure & organization | 20% |
| UI/UX & Responsive design | 15% |
| Error handling & Edge cases | 10% |
| Code quality (clean, readable, reusable) | 10% |
| Bonus features | 5% |

---

## ⏰ Thời gian

- **Thời gian làm bài:** 3-5 ngày
- **Nộp bài:** Push code lên GitHub repository (public) và gửi link

---

## 📝 Lưu ý

1. **KHÔNG copy paste** code từ example. Hãy tự viết lại để hiểu logic.
2. Ưu tiên **hoàn thành chức năng** trước, sau đó mới tối ưu UI.
3. Xử lý **error handling** đầy đủ (try/catch, toast thông báo lỗi).
4. Đặt tên biến, component, function **rõ ràng và nhất quán**.
5. Commit thường xuyên với message mô tả rõ thay đổi.
6. Viết **README.md** hướng dẫn cài đặt và chạy project.

---

## 🎯 Gợi ý thứ tự thực hiện

1. Setup project (Vite + Tailwind + Router + Axios)
2. Tạo Layout (Header + Footer)
3. Làm trang Login & Sign Up + AuthContext
4. Làm trang Home (hiển thị danh sách blog)
5. Làm trang Blog Details
6. Làm ProtectedRoute
7. Làm trang Create Blog
8. Làm trang My Posts
9. Làm trang User Management
10. Thêm search, dark mode, và các bonus features

---

Good luck! 🍀