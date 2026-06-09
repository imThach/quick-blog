const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

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

const throwError = (status, message) => {
    const error = new Error(message);
    error.status = status;
    throw error;
};

exports.register = async (userData) => {
    const { username, email, password } = userData;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throwError(400, 'Email đã tồn tại');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new User({
        username,
        email,
        password: hashedPassword
    });
    await newUser.save();

    const tokens = generateTokens(newUser);
    newUser.refreshToken = tokens.refreshToken;
    await newUser.save();
    return { user: newUser, tokens };
};

exports.login = async (credentials) => {
    const { email, password } = credentials;
    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
        throwError(401, 'Email hoặc mật khẩu không chính xác');
    }
    const tokens = generateTokens(user);
    user.refreshToken = tokens.refreshToken;
    await user.save();
    return { user, tokens };
};

exports.refreshToken = async (token) => {
    if (!token) {
        throwError(401, 'Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại');
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
        const user = await User.findById(decoded.id);
        // Kiểm tra token có khớp với DB không (chống reuse token cũ)
        if (!user || user.refreshToken !== token) {
            throwError(403, 'Refresh Token không hợp lệ hoặc đã bị thu hồi!');
        }
        const tokens = generateTokens(user);
        user.refreshToken = tokens.refreshToken;
        await user.save();
        return tokens;
    } catch (error) {
        throwError(403, 'Refresh Token không hợp lệ hoặc đã hết hạn!');
    }
};

exports.logout = async (userId) => {
    const user = await User.findById(userId);
    if (user) {
        user.refreshToken = null;
        await user.save();
    }
};

exports.getMe = async (userId) => {
    const user = await User.findById(userId).select('-password');
    if (!user) {
        throwError(404, 'Không tìm thấy thông tin người dùng!');
    }
    return user;
};