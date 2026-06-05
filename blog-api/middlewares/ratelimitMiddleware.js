const rateLimit = require('express-rate-limit');
exports.loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: { message: 'Bạn đã đăng nhập sai quá nhiều lần. Vui lòng thử lại sau 15 phút!' },
    standardHeaders: true,
    legacyHeaders: false,
});