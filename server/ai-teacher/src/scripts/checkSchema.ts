
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../../.env') });

const checkSchema = async () => {
    let connection;
    try {
        connection = await mysql.createConnection({
            host: process.env.DB_HOST || '116.62.120.101',
            port: Number(process.env.DB_PORT) || 13306,
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || 'wzx@@213',
            database: process.env.DB_NAME || 'ai-teacher',
        });

        console.log('✅ Connected.');

        const [tutorsColumns]: any = await connection.execute('DESCRIBE tutors');
        console.log('\n📊 Tutors Table Columns:');
        console.log(JSON.stringify(tutorsColumns, null, 2));

        const [usersColumns]: any = await connection.execute('DESCRIBE users');
        console.log('\n📊 Users Table Columns:');
        console.log(JSON.stringify(usersColumns, null, 2));

    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        if (connection) await connection.end();
    }
};

checkSchema();
