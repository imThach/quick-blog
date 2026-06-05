const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { verifyToken } = require('../middlewares/authMiddleware');
const { validateRegister, validateLogin } = require('../middlewares/validateMiddleware');
const { loginLimiter } = require('../middlewares/ratelimitMiddleware');

/**
 * @swagger
 * tags:
 *   - name: Auth
 *     description: Quản lý xác thực người dùng
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Đăng ký tài khoản mới
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Đăng ký thành công
 *       400:
 *         description: Lỗi dữ liệu đầu vào
 */

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Đăng nhập vào hệ thống
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Đăng nhập thành công
 *       401:
 *         description: Sai email hoặc mật khẩu
 */

/**
 * @swagger
 * /api/auth/refresh:
 *   post:
 *     summary: Cấp lại Access Token mới (Yêu cầu Cookie)
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Thành công
 */

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Đăng xuất (Xóa Cookie)
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Đăng xuất thành công
 */

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Lấy thông tin tài khoản đang đăng nhập
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Trả về thông tin user
 *       401:
 *         description: Chưa đăng nhập
 */

router.post('/register', validateRegister, authController.register);
router.post('/login', validateLogin, loginLimiter, authController.login);
router.post('/refresh', authController.refreshToken);
router.post('/logout', authController.logout);
router.get('/me', verifyToken, authController.getMe);
module.exports = router;