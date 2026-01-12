
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../../.env') });

const checkTables = async () => {
    let connection;
    try {
        connection = await mysql.createConnection({
            host: process.env.DB_HOST || '116.62.120.101',
            port: Number(process.env.DB_PORT) || 13306,
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || 'wzx@@213',
            database: 'ai-teacher'
        });

        console.log('Connected to ai-teacher');

        const [users]: any = await connection.execute('SHOW TABLES LIKE "l_users"');
        console.log('l_users exists:', users.length > 0);

        const [usersRaw]: any = await connection.execute('SHOW TABLES LIKE "users"');
        console.log('users exists:', usersRaw.length > 0);

        if (users.length > 0) {
            const [cols]: any = await connection.execute('DESCRIBE l_users');
            console.log('\nColumns in l_users:');
            console.log(cols.map((c: any) => c.Field));
        }

    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        if (connection) await connection.end();
    }
};

checkTables();
