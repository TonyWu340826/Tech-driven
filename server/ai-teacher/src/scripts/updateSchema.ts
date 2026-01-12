
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../../.env') });

async function run() {
    console.log('🔌 Connecting to database...');
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST || '116.62.120.101',
        port: Number(process.env.DB_PORT) || 13306,
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || 'wzx@@213',
        database: process.env.DB_NAME || 'ai-teacher',
    });
    try {
        console.log('✅ Connected.');

        // Add gender column if not exists
        const [columns]: any = await connection.execute('SHOW COLUMNS FROM users LIKE "gender"');
        if (columns.length === 0) {
            await connection.execute('ALTER TABLE users ADD COLUMN gender ENUM(\'male\', \'female\', \'other\') AFTER avatar');
            console.log('✅ Added gender column to users table');
        } else {
            console.log('ℹ️ Gender column already exists');
        }

        // Update existing users with some dummy data for demo
        await connection.execute("UPDATE users SET gender = 'female' WHERE name LIKE '%Sarah%' OR name LIKE '%Emily%' OR name LIKE '%Maria%'");
        await connection.execute("UPDATE users SET gender = 'male' WHERE name LIKE '%David%' OR name LIKE '%Alex%' OR name LIKE '%Johnson%'");
        console.log('✅ Updated gender for existing users');

        // Ensure some avatars are null to test fallback
        await connection.execute("UPDATE users SET avatar = NULL WHERE avatar = '' OR avatar = 'null'");

    } catch (e: any) {
        console.error('❌ Error:', e.message);
    } finally {
        await connection.end();
    }
}
run();
