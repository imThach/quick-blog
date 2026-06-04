const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Hàm hỗ trợ tạo Token
const generateTokens = (user) => {
    const accessToken = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_ACCESS_SECRET,
        { expiresIn: '10m' }
    );
    const refreshToken = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: '7d' }
    );
    return { accessToken, refreshToken };
};

//dang ky
exports.register = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email đã tồn tại' });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            username,
            email,
            password: hashedPassword
        });
        await newUser.save();

        const { accessToken, refreshToken } = generateTokens(newUser);
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'None',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.status(201).json({
            message: 'Đăng ký tài khoản thành công!',
            accessToken,
            user: {
                _id: newUser._id,
                username: newUser.username,
                email: newUser.email,
                role: newUser.role
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
};

//dang nhap
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: 'Email hoặc mật khẩu không chính xác' });
        }
        const { accessToken, refreshToken } = generateTokens(user);
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'None',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.status(200).json({
            message: 'Đăng nhập thành công!',
            accessToken,
            user: {
                _id: user._id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
};

//refresh token
exports.refreshToken = async (req, res) => {
    try {
        const token = req.cookies.refreshToken;
        if (!token) {
            return res.status(401).json({ message: 'Không tìm thấy Refresh Token, vui lòng đăng nhập lại!' });
        }

        jwt.verify(token, process.env.JWT_REFRESH_SECRET, async (err, decoded) => {
            if (err) {
                return res.status(403).json({ message: 'Refresh Token không hợp lệ hoặc đã hết hạn!' });
            }
            const user = await User.findById(decoded.id);
            if (!user) {
                return res.status(404).json({ message: 'Người dùng không tồn tại!' });
            }
            const { accessToken, refreshToken: newRefreshToken } = generateTokens(user);

            res.cookie('refreshToken', newRefreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'None',
                maxAge: 7 * 24 * 60 * 60 * 1000
            });
            res.status(200).json({ accessToken });
        });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
};

// dang xuat
exports.logout = (req, res) => {
    try {
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
        const userId = req.user.id;
        const user = await User.findById(userId).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'Không tìm thấy thông tin người dùng!' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
};