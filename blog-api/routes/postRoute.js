const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const { verifyToken } = require('../middlewares/authMiddleware');
const { validatePost } = require('../middlewares/validateMiddleware');

/**
 * @swagger
 * tags:
 *   - name: Posts
 *     description: Quản lý bài viết Blog
 */

/**
 * @swagger
 * /api/posts:
 *   get:
 *     summary: Lấy danh sách bài viết (Có phân trang và lọc)
 *     tags: [Posts]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Số trang
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Số lượng bài trên mỗi trang
 *       - in: query
 *         name: tags
 *         schema:
 *           type: string
 *         description: Lọc theo tag (VD - react,node)
 *     responses:
 *       200:
 *         description: Thành công
 *   post:
 *     summary: Tạo bài viết mới
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               image:
 *                 type: string
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: Tạo thành công
 */

/**
 * @swagger
 * /api/posts/{id}:
 *   get:
 *     summary: Lấy chi tiết 1 bài viết
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Thành công
 *   put:
 *     summary: Cập nhật bài viết (Chỉ dành cho tác giả)
 *     tags: [Posts]
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
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               image:
 *                 type: string
 *               tags:
*                 type: array
*                 items:
*                   type: string
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *   delete:
 *     summary: Xóa bài viết (Tác giả hoặc Admin)
 *     tags: [Posts]
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

router.get('/', postController.getPosts);
router.get('/:id', postController.getPostById);

// access token needed
router.post('/', verifyToken, validatePost, postController.createPost);
router.put('/:id', verifyToken, validatePost, postController.updatePost);
router.delete('/:id', verifyToken, postController.deletePost);

module.exports = router;