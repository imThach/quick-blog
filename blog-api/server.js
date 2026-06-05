require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoute');
const postRoutes = require('./routes/postRoute');
const userRoutes = require('./routes/userRoute');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');

const app = express();

connectDB();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan('dev'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
// Cấu hình CORS để Vercel Frontend có thể gọi API mà không bị chặn
app.use(cors({
    origin: ['https://blog-app-ivory-sigma.vercel.app', 'http://localhost:5173'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE']
}));
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/users', userRoutes);
// test
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to QuickBlog API!' });
});

// 3. Khởi chạy Server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(` Server is running on port ${PORT}`);
});