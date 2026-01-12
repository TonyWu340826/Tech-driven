
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../../.env') });

async function seed() {
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

        // Clear existing tags to avoid duplicates
        await connection.execute('DELETE FROM tutor_tags');

        // Seed tags for Sarah Jenkins (Tutor ID 1)
        await connection.execute("INSERT INTO tutor_tags (tutor_id, tag) VALUES (1, '上门辅导'), (1, '在线授课')");

        // Seed tags for David Kim (Tutor ID 2)
        await connection.execute("INSERT INTO tutor_tags (tutor_id, tag) VALUES (2, '仅限在线')");

        // Seed tags for Emily Chen (Tutor ID 3)
        await connection.execute("INSERT INTO tutor_tags (tutor_id, tag) VALUES (3, '上门辅导')");

        console.log('✅ Seeded tags');

        // Update tutor counts and ratings
        await connection.execute("UPDATE tutors SET rating = 4.9, review_count = 120 WHERE id = 1");
        await connection.execute("UPDATE tutors SET rating = 4.8, review_count = 85 WHERE id = 2");
        await connection.execute("UPDATE tutors SET rating = 5.0, review_count = 42 WHERE id = 3");

        console.log('✅ Updated tutor ratings/counts');

    } catch (e: any) {
        console.error('❌ Error:', e.message);
    } finally {
        await connection.end();
    }
}
seed();
