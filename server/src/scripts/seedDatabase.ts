import pool from '../config/database';
import bcrypt from 'bcryptjs';
import { ResultSetHeader, RowDataPacket } from 'mysql2';

const seedDatabase = async () => {
    const connection = await pool.getConnection();

    try {
        console.log('🌱 Starting database seeding...');

        // Clear existing data (order matters due to foreign keys)
        await connection.query('DELETE FROM l_messages');
        await connection.query('DELETE FROM l_conversations');
        await connection.query('DELETE FROM l_bookings');
        await connection.query('DELETE FROM l_reviews');
        await connection.query('DELETE FROM l_certifications');
        await connection.query('DELETE FROM l_tutor_tags');
        await connection.query('DELETE FROM l_tutors');
        await connection.query('DELETE FROM l_users');

        console.log('🧹 Cleared existing data');

        // Default password for all users
        const salt = await bcrypt.genSalt(10);
        const password = await bcrypt.hash('password123', salt);

        // --- 1. Create Student User ---
        const [studentResult] = await connection.query<ResultSetHeader>(
            'INSERT INTO l_users (name, email, password, role, bio) VALUES (?, ?, ?, ?, ?)',
            ['Student User', 'student@example.com', password, 'student', 'I love learning!']
        );
        const studentId = studentResult.insertId;
        console.log(`👤 Created student user (ID: ${studentId})`);

        // --- 2. Create Tutors ---

        // Tutor 1: Sarah Jenkins (Math)
        const [t1User] = await connection.query<ResultSetHeader>(
            'INSERT INTO l_users (name, email, password, role, avatar) VALUES (?, ?, ?, ?, ?)',
            ['Sarah Jenkins', 'sarah@example.com', password, 'tutor', 'https://lh3.googleusercontent.com/aida-public/AB6AXuDmivbYrie6tocV7J9B4edTyk6ydqFZgkEbExmhF2ZpMnH15wW19gM-Db_q6IVaNg3LyAHlilo7UJUWLPYIj43BeW20pwAo4-VQZKveJxJm-g48VbBwm1mWLTjqi-6lAUjy434jOPy8pckfnGRXWd-TtuH4o27MYRhQp77CnyJFr5MRPXj9C3mpCBr-KPYH8QVsP6DUiG53ntFacwzo8A1O_-ktogy0dARDpbxspHop_FpCuEJP1voRTcoR7zarxYplz6Mdi2_SnSA6']
        );
        const [t1Tutor] = await connection.query<ResultSetHeader>(
            'INSERT INTO l_tutors (user_id, title, price_per_hour, rating, review_count, verified, subject, bio) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [t1User.insertId, '认证数学老师', 40, 4.9, 120, true, 'Math', '热爱数学教学，拥有超过5年的辅导经验，致力于帮助学生实现学术目标。我擅长将复杂的微积分问题分解为简单易懂的步骤。']
        );
        const t1Id = t1Tutor.insertId;

        // Tags & Certs for Sarah
        await connection.query('INSERT INTO l_tutor_tags (tutor_id, tag) VALUES (?, ?), (?, ?)', [t1Id, '上门辅导', t1Id, '在线授课']);
        await connection.query('INSERT INTO l_certifications (tutor_id, title, issuer, icon, color_class) VALUES (?, ?, ?, ?, ?)', [t1Id, '数学学士', '斯坦福大学 • 2018', 'school', 'text-primary']);
        await connection.query('INSERT INTO l_certifications (tutor_id, title, issuer, icon, color_class) VALUES (?, ?, ?, ?, ?)', [t1Id, '认证数学老师', '国家家教协会 • 2019', 'workspace_premium', 'text-primary']);

        // Reviews for Sarah
        await connection.query('INSERT INTO l_reviews (tutor_id, user_id, rating, content) VALUES (?, ?, ?, ?)', [t1Id, studentId, 5.0, 'Sarah 非常有耐心。我的儿子之前在代数II上很吃力，但她能用一种让他顿悟的方式解释概念。强烈推荐！']);

        // Tutor 2: David Kim (Science)
        const [t2User] = await connection.query<ResultSetHeader>(
            'INSERT INTO l_users (name, email, password, role, avatar) VALUES (?, ?, ?, ?, ?)',
            ['David Kim', 'david@example.com', password, 'tutor', 'https://lh3.googleusercontent.com/aida-public/AB6AXuDxEzMuti2QYb8LzMkd-y57Byr5enMLtSp5ATAQ5z4CCq5zbtYVCEGDHpQCmczYhnwRr7qaxwC_FHJ3s2i8rHbVH_SYMe4R3w7GBKczXREMf2SpCxkO09nCkpIIqye84sh45_3LbIdTQpBcpNFynlLXF95JARgfW9OSu-tzAkTReqTDlztAiDB-HF1H-uJ1Rpt1rLULjKtnphV1wM9GN_MMEX1vfjzuU_m1PP9vxjDGywREnLiRhbMtj3IBB3hj3X_hIKW6-0693b0q']
        );
        const [t2Tutor] = await connection.query<ResultSetHeader>(
            'INSERT INTO l_tutors (user_id, title, price_per_hour, rating, review_count, verified, subject, bio) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [t2User.insertId, '物理与化学专家', 35, 4.8, 85, true, 'Science', '专注于帮助学生理解物理和化学的核心概念，而不仅仅是死记硬背。']
        );
        const t2Id = t2Tutor.insertId;
        await connection.query('INSERT INTO l_tutor_tags (tutor_id, tag) VALUES (?, ?)', [t2Id, '仅限在线']);

        // Tutor 3: Emily Chen (Music)
        const [t3User] = await connection.query<ResultSetHeader>(
            'INSERT INTO l_users (name, email, password, role, avatar) VALUES (?, ?, ?, ?, ?)',
            ['Emily Chen', 'emily@example.com', password, 'tutor', 'https://lh3.googleusercontent.com/aida-public/AB6AXuDblzpE5w_EpQ9_0dytdSFygbBES70IaLzOkhGMXslZoPo_z78aLYzurK35jlo9pXo06QsCumqh7_-4w40Ivb3g1z9X8FB5lk7Y5jqJ0UxMXgSsKX9Q7xKjVtus1EHab76PMsU51UazLv2FSH8AG3-_PqtxrvW02ZACDiXZaGWaHvKs9jJ1ha2X1vOSP4LnZou_hucSS_bHOHZerdNakLisgSJgtuinJqjDuj8Q03xI9KNLZRkievFGl2kx_s2rKzTsM2_BasneNTxP']
        );
        const [t3Tutor] = await connection.query<ResultSetHeader>(
            'INSERT INTO l_tutors (user_id, title, price_per_hour, rating, review_count, verified, subject, bio) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [t3User.insertId, '钢琴与乐理', 50, 5.0, 42, false, 'Music', '钢琴表演硕士，10年教学经验。']
        );
        const t3Id = t3Tutor.insertId;
        await connection.query('INSERT INTO l_tutor_tags (tutor_id, tag) VALUES (?, ?)', [t3Id, '上门辅导']);

        console.log('🧑‍🏫 Created tutors');

        // --- 3. Create Bookings ---
        const now = new Date();
        const tomorrow = new Date(now); tomorrow.setDate(tomorrow.getDate() + 1);

        await connection.query(
            'INSERT INTO l_bookings (student_id, tutor_id, subject, status, start_time, end_time, type, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [studentId, t1Id, 'Physics • High School', 'upcoming', new Date(now.getTime() + 10 * 60000), new Date(now.getTime() + 70 * 60000), 'online', 'Prepare for midterm']
        );
        console.log('📅 Created bookings');

        // --- 4. Create Conversations & Messages ---

        // Convo with Sarah
        const [c1] = await connection.query<ResultSetHeader>(
            'INSERT INTO l_conversations (student_id, tutor_id) VALUES (?, ?)',
            [studentId, t1Id]
        );
        await connection.query(
            'INSERT INTO l_messages (conversation_id, sender_id, message_text) VALUES (?, ?, ?), (?, ?, ?)',
            [c1.insertId, studentId, '你好，Sarah，我想重新安排一下周二的课程。', c1.insertId, t1User.insertId, '没问题！周三下午3点可以吗？']
        );

        // Convo with David
        const [c2] = await connection.query<ResultSetHeader>(
            'INSERT INTO l_conversations (student_id, tutor_id) VALUES (?, ?)',
            [studentId, t2Id]
        );
        await connection.query(
            'INSERT INTO l_messages (conversation_id, sender_id, message_text) VALUES (?, ?, ?)',
            [c2.insertId, t2User.insertId, '请记得把作业发给我。']
        );

        console.log('💬 Created conversations');

        console.log('✅ Database seeding completed successfully!');
        process.exit(0);

    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    } finally {
        connection.release();
    }
};

seedDatabase();
