# **Backend Challenge - Blog API**

## **Bối cảnh**

Bài này yêu cầu xây dựng một **REST API cho ứng dụng Blog** bằng **Node.js, Express, MongoDB và JWT**.

---

## **Mục tiêu sản phẩm**

Hệ thống cần hỗ trợ:

- đăng ký và đăng nhập
- xác thực bằng access token và refresh token
- đăng xuất
- lấy thông tin user hiện tại
- tạo, xem, cập nhật, xóa bài viết
- phân quyền `user` và `admin`
- quản lý user dành cho admin
- phân trang, lọc dữ liệu và tài liệu Swagger

---

## **Tech Stack**

| **Công nghệ** | **Mục đích** |
| --- | --- |
| Node.js | Runtime |
| Express 5 | Web framework |
| MongoDB + Mongoose | Database |
| JWT | Authentication |
| bcrypt | Hash mật khẩu |
| Joi hoặc express-validator | Validation |
| express-rate-limit | Giới hạn brute-force |
| swagger-jsdoc + swagger-ui-express | API docs |
| dotenv | Environment variables |
| morgan | Logging |
| cookie-parser | Hỗ trợ refresh token qua cookie |

---

## **Phạm vi chức năng**

### **1. Authentication**

- Đăng ký tài khoản với `username`, `email`, `password`
- Đăng nhập bằng `email` và `password`
- Trả về:
    - `accessToken`
    - `refreshToken`
- Refresh token phải được lưu và kiểm tra hợp lệ khi gọi refresh
- Có endpoint lấy thông tin user hiện tại
- Logout phải vô hiệu hóa refresh token

### **2. Posts**

- Người dùng đã đăng nhập có thể tạo bài viết
- Mỗi bài viết có:
    - `title`
    - `content`
    - `image`
    - `tags`
    - `author`
- Danh sách bài viết phải hỗ trợ:
    - phân trang bằng `page` và `limit`
    - lọc theo `author`
    - lọc theo `tags`
- Xem chi tiết bài viết theo `id`
- Chỉ tác giả mới được cập nhật bài viết
- Tác giả hoặc admin mới được xóa bài viết

### **3. Users**

- Chỉ `admin` được xem danh sách user
- Chỉ `admin` được xóa user
- Chỉ `admin` được đổi role user
- Khi xóa user, cần xử lý các bài viết liên quan phù hợp

### **4. Validation và Security**

- Validate toàn bộ input quan trọng
- Chống spam login bằng rate limit
- Bảo vệ route cần xác thực bằng JWT middleware
- Bảo vệ route admin bằng role middleware
- Không để lộ dữ liệu nhạy cảm trong response

### **5. Documentation**

- Swagger phải mô tả đầy đủ endpoint chính
- README phải có hướng dẫn cài đặt, cấu hình và chạy project

---

## **API Specification**

Base URL được cấu hình qua biến môi trường. Swagger UI phải hoạt động tại `/api-docs`.

## **Response Rules**

### **Nguyên tắc chung**

- Response phải nhất quán
- Lỗi phải trả về object có field `message`
- Dữ liệu list phải có pagination metadata
- Dữ liệu trả về không được lộ password hoặc refresh token

### **Ví dụ response**

### **Login**

```json
{
  "accessToken": "jwt_access_token",
  "refreshToken": "jwt_refresh_token"
}
```

### **Get posts**

```json
{
  "items": [
    {
      "_id": "...",
      "title": "...",
      "content": "...",
      "image": "https://...",
      "tags": ["test", "demo"],
      "author": {
        "_id": "...",
        "username": "testuser",
        "email": "test@example.com",
        "role": "user"
      },
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "page": 1,
  "limit": 10,
  "total": 1,
  "totalPages": 1
}
```

### **Error**

```json
{
  "message": "Unauthorized"
}
```

---

## **Yêu cầu bắt buộc**

### **1. Kiến trúc**

- Tổ chức code theo module rõ ràng
- Có tách biệt giữa route, controller, middleware, model, validation
- Có file khởi động ứng dụng và file cấu hình riêng

### **2. Authentication**

- Có đăng ký và đăng nhập
- Mật khẩu phải được hash trước khi lưu
- Có access token và refresh token
- Có logout và refresh flow hoàn chỉnh
- Có endpoint `me`

### **3. Blog Posts**

- Có CRUD bài viết
- Có phân quyền theo tác giả và admin
- Có pagination
- Có filter theo author và tags

### **4. User Management**

- Admin xem được danh sách user
- Admin xóa user
- Admin cập nhật role user

### **5. API Quality**

- Có validation đầu vào
- Có error handling tập trung
- Có rate limit cho login
- Có Swagger docs
