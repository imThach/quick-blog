const userService = require('../service/userService');

exports.getAllUsers = async (req, res) => {
    try {
        const users = await userService.getAllUsers();
        res.status(200).json(users);
    } catch (error) {
        const status = error.status || 500;
        res.status(status).json({ message: error.message || 'Lỗi server' });
    }
};

exports.updateRole = async (req, res) => {
    try {
        const { role } = req.body;
        const updatedUser = await userService.updateUserRole(req.params.id, role);
        res.status(200).json({ message: 'Cập nhật quyền thành công!', user: updatedUser });
    } catch (error) {
        const status = error.status || 500;
        res.status(status).json({ message: error.message || 'Lỗi server' });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        if (req.user.id === req.params.id) {
            return res.status(400).json({ message: 'Bạn không thể tự xóa tài khoản của chính mình!' });
        }
        const result = await userService.deleteUser(req.params.id);
        res.status(200).json(result);
    } catch (error) {
        const status = error.status || 500;
        res.status(status).json({ message: error.message || 'Lỗi server' });
    }
};