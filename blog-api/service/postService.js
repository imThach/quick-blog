const Post = require('../models/post');

const throwError = (status, message) => {
    const error = new Error(message);
    error.status = status;
    throw error;
};

//tao bai viet
exports.createPost = async (postData, authorId) => {
    const newPost = new Post({
        ...postData,
        author: authorId
    });
    await newPost.save();
    return newPost;
};

// get bai viet co phan trang va filter
exports.getPosts = async (query) => {
    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 10;
    const skip = (page - 1) * limit;

    let filter = {};
    if (query.author) {
        filter.author = query.author;
    }
    if (query.userId) {
        filter.author = query.userId;
    }
    if (query.tags) {
        const tagsArray = query.tags.split(',');
        filter.tags = { $in: tagsArray };
    }

    const total = await Post.countDocuments(filter);
    const posts = await Post.find(filter)
        .populate('author', 'username email role')
        .sort({ createdAt: -1 }) 
        .skip(skip)
        .limit(limit);

    return {
        items: posts,
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
    };
};

// chi tiet bai viet
exports.getPostById = async (postId) => {
    const post = await Post.findById(postId).populate('author', 'username email role');
    if (!post) throwError(404, 'Không tìm thấy bài viết!');
    return post;
};

// update post
exports.updatePost = async (postId, updateData, userId) => {
    const post = await Post.findById(postId);
    if (!post) {
        throwError(404, 'Không tìm thấy bài viết!');
    }
    if (post.author.toString() !== userId) {
        throwError(403, 'Bạn không có quyền cập nhật bài viết này!');
    }
    const updatedPost = await Post.findByIdAndUpdate(
        postId,
        { $set: updateData },
        { new: true, runValidators: true }
    ).populate('author', 'username email role');
    return updatedPost;
};

// xoa post
exports.deletePost = async (postId, user) => {
    const post = await Post.findById(postId);
    if (!post) throwError(404, 'Không tìm thấy bài viết!');

    if (post.author.toString() !== user.id && user.role !== 'admin') {
        throwError(403, 'Bạn không có quyền xóa bài viết này!');
    }

    await Post.findByIdAndDelete(postId);
    return { message: 'Xóa bài viết thành công!' };
};