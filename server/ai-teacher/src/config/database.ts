import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'ai-teacher',
    waitForConnections: true,
    connectionLimit: 5, // Reduced from default 10
    queueLimit: 0,
    connectTimeout: 20000, // Increase timeout to 20s
    enableKeepAlive: true,
    keepAliveInitialDelay: 0
});

// Test connection
pool.getConnection()
    .then(connection => {
        console.log(`✅ Database connected successfully to ${process.env.DB_HOST || 'localhost'}`);
        connection.release();
    })
    .catch(err => {
        console.error('❌ Database connection failed!');
        console.error('Error details:', err.message || err);
        console.log('Current DB Config (no password shown):', {
            host: process.env.DB_HOST || 'localhost',
            port: Number(process.env.DB_PORT) || 3306,
            user: process.env.DB_USER || 'root',
            database: process.env.DB_NAME || 'ai-teacher'
        });
    });

export default pool;
