import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';

// 强制使用基于当前文件位置的绝对路径加载 .env
dotenv.config({ path: path.resolve(__dirname, '../.env') });

import authRoutes from './routes/authRoutes';
import tutorRoutes from './routes/tutorRoutes';
import bookingRoutes from './routes/bookingRoutes';
import messageRoutes from './routes/messageRoutes';

if (!process.env.JWT_SECRET) {
    console.warn('⚠️ Warning: JWT_SECRET is not defined in environment variables. Using a default secret for development.');
    process.env.JWT_SECRET = 'your-super-secret-jwt-key-change-in-production';
}

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tutors', tutorRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/messages', messageRoutes);

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date() });
});

// ---------------------------------------------------------
// 部署配置：托管前端静态文件
// ---------------------------------------------------------
// 生产环境下，Express 会直接提供 React 打包后的静态文件
// 请将前端 build 生成的 dist 目录重命名为 public 并放入 server 目录下
const publicPath = path.join(__dirname, '../public');

// 1. 静态资源托管
app.use(express.static(publicPath));

// 2. 所有非 API 请求都返回 index.html (由前端路由处理)
app.get('*', (req, res) => {
    res.sendFile(path.join(publicPath, 'index.html'));
});

// Start server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
