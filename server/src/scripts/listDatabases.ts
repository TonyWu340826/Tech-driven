
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../../.env') });

const checkDbs = async () => {
    let connection;
    try {
        console.log('Connecting with config:');
        console.log({
            host: process.env.DB_HOST || '116.62.120.101',
            port: Number(process.env.DB_PORT) || 13306,
            user: process.env.DB_USER || 'root',
            database: process.env.DB_NAME || 'ai-teacher',
        });

        connection = await mysql.createConnection({
            host: process.env.DB_HOST || '116.62.120.101',
            port: Number(process.env.DB_PORT) || 13306,
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || 'wzx@@213',
        });

        const [databases]: any = await connection.execute('SHOW DATABASES');
        console.log('\n📁 Databases:');
        console.log(databases.map((db: any) => db.Database));

        const targetDb = process.env.DB_NAME || 'ai-teacher';
        console.log(`\nChecking database: ${targetDb}`);

        await connection.query(`USE \`${targetDb}\``);
        const [tables]: any = await connection.execute('SHOW TABLES');
        console.log('\n📊 Tables:');
        console.log(tables);

        if (databases.map((db: any) => db.Database).includes('ai-teacher')) {
            console.log('\nChecking database: ai-teacher');
            await connection.query('USE `ai-teacher`');
            const [tablesAi]: any = await connection.execute('SHOW TABLES');
            console.log('\n📊 Tables in ai-teacher:');
            console.log(tablesAi);
        }

    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        if (connection) await connection.end();
    }
};

checkDbs();
