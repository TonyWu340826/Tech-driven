import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../../.env') });

const checkData = async () => {
    let connection;
    try {
        console.log('🔌 Connecting to database...');
        console.log('Host:', process.env.DB_HOST);
        console.log('Port:', process.env.DB_PORT);
        console.log('Database:', process.env.DB_NAME);

        connection = await mysql.createConnection({
            host: process.env.DB_HOST || '116.62.120.101',
            port: Number(process.env.DB_PORT) || 13306,
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || 'wzx@@213',
            database: process.env.DB_NAME || 'ai-teacher',
        });

        console.log('✅ Connected.');

        // Check Users
        const [users]: any = await connection.execute('SELECT id, name, email, role FROM users');
        console.log('\n📊 Users in Database:', users.length);
        console.table(users);

        // Check Tutors
        const [tutors]: any = await connection.execute('SELECT t.id, u.name, t.price_per_hour FROM tutors t JOIN users u ON t.user_id = u.id');
        console.log('\n🎓 Tutors in Database:', tutors.length);
        console.table(tutors);

    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        if (connection) await connection.end();
    }
};

checkData();
