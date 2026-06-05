const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { verifyToken, isAdmin } = require('../middlewares/authMiddleware');

/**
 * @swagger
 * tags:
 *   - name: Users
 *     description: Quản lý người dùng (Chỉ dành cho Admin)
 */

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Lấy danh sách toàn bộ người dùng
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Thành công
 */

/**
 * @swagger
 * /api/users/{id}/role:
 *   put:
 *     summary: Cấp quyền hoặc hạ quyền người dùng
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               role:
 *                 type: string
 *                 example: admin
 *     responses:
 *       200:
 *         description: Cập nhật quyền thành công
 */

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Xóa tài khoản và toàn bộ bài viết của người đó
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Xóa thành công
 */

router.use(verifyToken, isAdmin);
router.get('/', userController.getAllUsers);
router.put('/:id/role', userController.updateRole);
router.delete('/:id', userController.deleteUser);

module.exports = router;