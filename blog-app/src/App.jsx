import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Home from './pages/Home';
import BlogDetails from './pages/BlogDetails';
import CreateBlog from './pages/CreateBlog';
import MyPost from './pages/MyPost';
import ProtectedRoute from './components/ProtectedRoute';
import UserManagement from './pages/UserManagement';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />

      <Route path="/" element={<Layout />}>

        {/* Nhóm 1: Ai cũng vào được (Public) */}
        <Route index element={<Home />} />
        <Route path="post/:id" element={<BlogDetails />} />

        {/* Nhóm 2: Phải đăng nhập mới vào được (User + Admin) */}
        <Route element={<ProtectedRoute allowedRoles={['user', 'admin']} />}>
          {/* Đã xóa thẻ create-blog trùng lặp ở trên và đưa vào đây */}
          <Route path="create-blog" element={<CreateBlog />} />
          <Route path="my-posts" element={<MyPost />} />
        </Route>

        {/* Nhóm 3: Cấm địa (Chỉ Admin) */}
        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
          <Route path="user-management" element={<UserManagement />} />
        </Route>

      </Route>
    </Routes>
  );
}

export default App;