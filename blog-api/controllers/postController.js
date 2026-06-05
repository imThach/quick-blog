const postService = require('../service/postService');

exports.createPost = async (req, res) => {
    try {
        const post = await postService.createPost(req.body, req.user.id);
        res.status(201).json(post);
    } catch (error) {
        res.status(error.status || 500).json({ message: error.message || 'Lỗi server' });
    }
};

exports.getPosts = async (req, res) => {
    try {
        const result = await postService.getPosts(req.query);
        res.status(200).json(result);
    } catch (error) {
        res.status(error.status || 500).json({ message: error.message || 'Lỗi server' });
    }
};

exports.getPostById = async (req, res) => {
    try {
        const post = await postService.getPostById(req.params.id);
        res.status(200).json(post);
    } catch (error) {
        res.status(error.status || 500).json({ message: error.message || 'Lỗi server' });
    }
};

exports.updatePost = async (req, res) => {
    try {
        const updatedPost = await postService.updatePost(req.params.id, req.body, req.user.id);
        res.status(200).json(updatedPost);
    } catch (error) {
        res.status(error.status || 500).json({ message: error.message || 'Lỗi server' });
    }
};

exports.deletePost = async (req, res) => {
    try {
        const result = await postService.deletePost(req.params.id, req.user);
        res.status(200).json(result);
    } catch (error) {
        res.status(error.status || 500).json({ message: error.message || 'Lỗi server' });
    }
};