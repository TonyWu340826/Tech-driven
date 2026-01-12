
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../../.env') });

const revertRename = async () => {
    let connection;
    try {
        connection = await mysql.createConnection({
            host: process.env.DB_HOST || '116.62.120.101',
            port: Number(process.env.DB_PORT) || 13306,
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || 'wzx@@213',
            database: process.env.DB_NAME || 'ai-teacher'
        });

        console.log(`Working on database: ${process.env.DB_NAME || 'ai-teacher'}`);

        const tablesToRename = [
            'bookings',
            'certifications',
            'conversations',
            'favorites',
            'messages',
            'reviews',
            'tutor_tags',
            'tutors',
            'users'
        ];

        for (const table of tablesToRename) {
            const oldName = table;
            const newName = `l_${table}`;

            const [exists]: any = await connection.execute(`SHOW TABLES LIKE "${oldName}"`);
            if (exists.length > 0) {
                const [targetExists]: any = await connection.execute(`SHOW TABLES LIKE "${newName}"`);
                if (targetExists.length === 0) {
                    console.log(`Renaming ${oldName} to ${newName}...`);
                    await connection.query('SET FOREIGN_KEY_CHECKS = 0');
                    await connection.query(`RENAME TABLE \`${oldName}\` TO \`${newName}\``);
                    await connection.query('SET FOREIGN_KEY_CHECKS = 1');
                    console.log(`✅ Renamed ${oldName} to ${newName}`);
                } else {
                    console.log(`⚠️ Target table ${newName} already exists, skipping rename of ${oldName}`);
                }
            } else {
                console.log(`ℹ️ Table ${oldName} not found, skipping.`);
            }
        }

    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        if (connection) await connection.end();
    }
};

revertRename();
