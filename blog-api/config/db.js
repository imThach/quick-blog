const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI, {
            family: 4 // Bắt buộc dùng IPv4 để tránh lỗi ECONNREFUSED trên Node.js mới
        });
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Lỗi kết nối MongoDB: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;