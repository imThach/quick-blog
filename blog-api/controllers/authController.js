const authService = require('../service/authService');

const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'None',
    maxAge: 7 * 24 * 60 * 60 * 1000
};

//dang ky
exports.register = async (req, res) => {
    try {
        const { user, tokens } = await authService.register(req.body);
        res.cookie('refreshToken', tokens.refreshToken, cookieOptions);
        res.status(201).json({
            message: 'Đăng ký tài khoản thành công!',
            accessToken: tokens.accessToken,
            user: {
                _id: user._id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        res.status(error.status || 500).json({ message: error.message || 'Lỗi server' });
    }
};

//dang nhap
exports.login = async (req, res) => {
    try {
        const { user, tokens } = await authService.login(req.body);
        res.cookie('refreshToken', tokens.refreshToken, cookieOptions);
        res.status(200).json({
            message: 'Đăng nhập thành công!',
            accessToken: tokens.accessToken,
            user: {
                _id: user._id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        res.status(error.status || 500).json({ message: error.message || 'Lỗi server' });
    }
};

//refresh token
exports.refreshToken = async (req, res) => {
    try {
        const tokens = await authService.refreshToken(req.cookies.refreshToken);
        res.cookie('refreshToken', tokens.refreshToken, cookieOptions);
        res.status(200).json({ accessToken: tokens.accessToken });

    } catch (error) {
        res.status(error.status || 500).json({ message: error.message || 'Lỗi server' });
    }
};

// dang xuat
exports.logout = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;

        if (refreshToken) {
            const jwt = require('jsonwebtoken');
            try {
                // Giải mã refreshToken để lấy id của user và xóa token trong DB
                const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
                await authService.logout(decoded.id);
            } catch (err) {
                // Nếu token đã hết hạn hoặc không hợp lệ, cứ bỏ qua và tiến hành xóa cookie
            }
        }

        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'None'
        });
        res.status(200).json({ message: 'Đăng xuất thành công!' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
};
// 5. LẤY THÔNG TIN USER HIỆN TẠI (ME)
exports.getMe = async (req, res) => {
    try {
        const user = await authService.getMe(req.user.id);
        res.status(200).json(user);
    } catch (error) {
        res.status(error.status || 500).json({ message: error.message || 'Lỗi server' });
    }
};