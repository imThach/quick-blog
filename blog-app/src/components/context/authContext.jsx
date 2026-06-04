import { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import axiosClient from '../services/api/axiosClient';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Kiểm tra token khi load lại trang
    useEffect(() => {
        const initializeAuth = async () => {
            const token = localStorage.getItem('accessToken');
            if (token) {
                try {
                    const response = await axiosClient.get('/auth/me');
                    let userData = response.user || response.data || response;

                    if (!userData?.role && token) {
                        const payload = JSON.parse(atob(token.split('.')[1]));
                        userData = { ...userData, ...payload };
                    }
                    if (userData?.role) {
                        userData.role = String(userData.role).toLowerCase();
                    }

                    setUser(userData);
                    localStorage.setItem('user', JSON.stringify(userData));
                } catch (error) {
                    console.error("Lỗi lấy thông tin từ token:", error);
                    localStorage.removeItem('accessToken');
                    localStorage.removeItem('user');
                }
            }
            setLoading(false);
        };

        initializeAuth();
    }, []);

    const login = async (email, password) => {
        try {
            const response = await axiosClient.post('/auth/login', { email, password });

            // Đề phòng API trả về key khác nhau (VD: token thay vì accessToken, data.user thay vì user)
            const token = response.accessToken || response.token || response.data?.token;
            let userData = response.user || response.data?.user || response;

            localStorage.setItem('accessToken', token);

            try {
                const meRes = await axiosClient.get('/auth/me');
                userData = meRes.user || meRes.data || meRes;
            } catch (e) { /* Bỏ qua nếu API lỗi */ }

            if (!userData?.role && token) {
                const payload = JSON.parse(atob(token.split('.')[1]));
                userData = { ...userData, ...payload };
            }
            if (userData?.role) userData.role = String(userData.role).toLowerCase();

            localStorage.setItem('user', JSON.stringify(userData));
            setUser(userData);
            toast.success('Đăng nhập thành công!');
            navigate('/');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Email hoặc mật khẩu không đúng!');
            throw error;
        }
    };

    const register = async (username, email, password) => {
        try {
            const response = await axiosClient.post('/auth/register', { username, email, password });
            const token = response.accessToken || response.token || response.data?.token;
            localStorage.setItem('accessToken', token);

            let userData = response.user || response.data?.user || response;
            try {
                const meRes = await axiosClient.get('/auth/me');
                userData = meRes.user || meRes.data || meRes;
            } catch (e) { }

            if (!userData?.role && token) {
                const payload = JSON.parse(atob(token.split('.')[1]));
                userData = { ...userData, ...payload };
            }
            if (userData?.role) userData.role = String(userData.role).toLowerCase();

            setUser(userData);
            localStorage.setItem('user', JSON.stringify(userData));

            toast.success('Đăng ký thành công!');
            navigate('/');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Đăng ký thất bại!');
            throw error;
        }
    };

    const logout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
        setUser(null);
        toast.success('Đã đăng xuất!');
        navigate('/login');
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);