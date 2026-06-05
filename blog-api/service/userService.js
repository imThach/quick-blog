const User = require('../models/user');
const Post = require('../models/post');

const throwError = (status, message) => {
    const error = new Error(message);
    error.status = status;
    throw error;
};

exports.getAllUsers = async () => {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    return users;
};

// change role
exports.updateUserRole = async (userId, newRole) => {
    if (!['user', 'admin'].includes(newRole)) {
        throwError(400, 'Role không hợp lệ! Chỉ nhận "user" hoặc "admin".');
    }
    const updatedUser = await User.findByIdAndUpdate(
        userId,
        { role: newRole },
        { new: true }
    ).select('-password');
    if (!updatedUser) throwError(404, 'Không tìm thấy người dùng!');
    return updatedUser;
};

// xoa user + bai viet cua user do
exports.deleteUser = async (userId) => {
    const user = await User.findById(userId);
    if (!user) throwError(404, 'Không tìm thấy người dùng!');
    await Post.deleteMany({ author: userId });
    await User.findByIdAndDelete(userId);
    return { message: `Đã xóa người dùng ${user.username} và toàn bộ bài viết của họ!` };
};