require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoute');

const app = express();

connectDB();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan('dev'));

// Cấu hình CORS để Vercel Frontend có thể gọi API mà không bị chặn
app.use(cors({
    origin: 'https://blog-app-ivory-sigma.vercel.app',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE']
}));
app.use('/api/auth', authRoutes);

// test
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to QuickBlog API!' });
});

// 3. Khởi chạy Server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});