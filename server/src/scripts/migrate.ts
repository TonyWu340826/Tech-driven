/**
 * Author: tonywu
 * Date: 2026-01-12
 * Description: 数据库迁移脚本 V2 - 使用更安全的方式更新表结构
 */

import pool from '../config/database';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

async function migrate() {
    const connection = await pool.getConnection();

    try {
        console.log('🔄 开始数据库迁移...');

        // 1. 更新 l_users 表
        console.log('\n📝 更新 l_users 表...');

        const [genderColumns] = await connection.query(
            "SHOW COLUMNS FROM l_users LIKE 'gender'"
        );

        if ((genderColumns as any[]).length === 0) {
            await connection.query(`
                ALTER TABLE l_users
                ADD COLUMN gender ENUM('male', 'female', 'other') DEFAULT 'male' AFTER role
            `);
            console.log('✅ 添加 gender 字段');
        } else {
            console.log('⏭️  gender 字段已存在');
        }

        const [balanceColumns] = await connection.query(
            "SHOW COLUMNS FROM l_users LIKE 'balance'"
        );

        if ((balanceColumns as any[]).length === 0) {
            await connection.query(`
                ALTER TABLE l_users
                ADD COLUMN balance DECIMAL(18,2) NOT NULL DEFAULT 0.00 COMMENT '钱包余额' AFTER gender
            `);
            console.log('✅ 添加 balance 字段');
        } else {
            console.log('⏭️  balance 字段已存在');
        }

        // 2. 更新 l_bookings 表
        console.log('\n📝 更新 l_bookings 表...');

        // 添加新字段（如果不存在）
        const [paymentStatusColumns] = await connection.query(
            "SHOW COLUMNS FROM l_bookings LIKE 'payment_status'"
        );

        if ((paymentStatusColumns as any[]).length === 0) {
            await connection.query(`
                ALTER TABLE l_bookings
                ADD COLUMN payment_status ENUM('unpaid', 'paid') DEFAULT 'unpaid' AFTER subject
            `);
            console.log('✅ 添加 payment_status 字段');
        } else {
            console.log('⏭️  payment_status 字段已存在');
        }

        const [amountColumns] = await connection.query(
            "SHOW COLUMNS FROM l_bookings LIKE 'amount'"
        );

        if ((amountColumns as any[]).length === 0) {
            await connection.query(`
                ALTER TABLE l_bookings
                ADD COLUMN amount DECIMAL(10, 2) NOT NULL DEFAULT 0.00 AFTER payment_status
            `);
            console.log('✅ 添加 amount 字段');
        } else {
            console.log('⏭️  amount 字段已存在');
        }

        const [addressColumns] = await connection.query(
            "SHOW COLUMNS FROM l_bookings LIKE 'address'"
        );

        if ((addressColumns as any[]).length === 0) {
            await connection.query(`
                ALTER TABLE l_bookings
                ADD COLUMN address VARCHAR(500) AFTER type
            `);
            console.log('✅ 添加 address 字段');
        } else {
            console.log('⏭️  address 字段已存在');
        }

        // 修改 status 字段 - 使用两步法
        console.log('\n📝 更新 status 字段...');

        // 第一步：先添加临时列
        try {
            await connection.query(`
                ALTER TABLE l_bookings
                ADD COLUMN status_new ENUM('pending', 'approved', 'completed', 'canceled') DEFAULT 'pending'
            `);
            console.log('✅ 添加临时 status_new 字段');

            // 第二步：复制数据，映射旧值到新值
            await connection.query(`
                UPDATE l_bookings
                SET status_new = CASE
                    WHEN status = 'upcoming' THEN 'approved'
                    WHEN status = 'completed' THEN 'completed'
                    WHEN status = 'canceled' THEN 'canceled'
                    ELSE 'pending'
                END
            `);
            console.log('✅ 迁移 status 数据');

            // 第三步：删除旧列
            await connection.query(`
                ALTER TABLE l_bookings
                DROP COLUMN status
            `);
            console.log('✅ 删除旧 status 字段');

            // 第四步：重命名新列
            await connection.query(`
                ALTER TABLE l_bookings
                CHANGE COLUMN status_new status ENUM('pending', 'approved', 'completed', 'canceled') DEFAULT 'pending'
            `);
            console.log('✅ 重命名 status 字段');
        } catch (error: any) {
            if (error.code === 'ER_DUP_FIELDNAME') {
                console.log('⏭️  status 字段已更新');
                // 清理可能存在的临时字段
                try {
                    await connection.query(`ALTER TABLE l_bookings DROP COLUMN status_new`);
                } catch (e) {
                    // 忽略错误
                }
            } else {
                throw error;
            }
        }

        // 添加索引
        console.log('\n📝 添加索引...');
        try {
            await connection.query(`
                ALTER TABLE l_bookings
                ADD INDEX idx_payment_status (payment_status)
            `);
            console.log('✅ 添加 payment_status 索引');
        } catch (error: any) {
            if (error.code === 'ER_DUP_KEYNAME') {
                console.log('⏭️  payment_status 索引已存在');
            } else {
                throw error;
            }
        }

        // 3. 创建 l_account_log 表
        console.log('\n📝 创建 l_account_log 表...');
        await connection.query(`
            CREATE TABLE IF NOT EXISTS l_account_log (
                id BIGINT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL COMMENT '用户ID',
                change_amount DECIMAL(18,2) NOT NULL COMMENT '变动金额（正加负减）',
                before_balance DECIMAL(18,2) NOT NULL COMMENT '变动前余额',
                after_balance DECIMAL(18,2) NOT NULL COMMENT '变动后余额',
                biz_type VARCHAR(50) NOT NULL COMMENT '业务类型',
                biz_id VARCHAR(100) DEFAULT NULL COMMENT '业务单号',
                remark VARCHAR(255) DEFAULT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES l_users(id) ON DELETE CASCADE,
                INDEX idx_user (user_id),
                INDEX idx_biz (biz_type, biz_id)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='钱包余额流水表'
        `);
        console.log('✅ l_account_log 表已就绪');

        console.log('\n✅ 数据库迁移完成！');
        console.log('📊 现在可以正常使用预约和钱包功能了。\n');

    } catch (error) {
        console.error('\n❌ 迁移失败:', error);
        throw error;
    } finally {
        connection.release();
        await pool.end();
    }
}

migrate().catch(error => {
    console.error('Migration failed:', error);
    process.exit(1);
});
