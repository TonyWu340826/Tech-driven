/**
 * Author: tonywu
 * Date: 2026-01-12
 * Description: 预约管理控制器 - 处理预约创建、查询、取消、支付等功能
 */

import { Response } from 'express';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
import pool from '../config/database';
import { AuthRequest, CreateBookingRequest } from '../types';

export const createBooking = async (req: AuthRequest, res: Response) => {
    try {
        const studentId = req.user?.id;
        if (!studentId) return res.status(401).json({ message: 'Unauthorized' });

        const { tutor_id, subject, start_time, end_time, type, notes, amount, address } = req.body;

        // 核心逻辑 1：校验同一天是否已经预约过该老师
        const bookingDate = start_time.split(' ')[0]; // 获取 YYYY-MM-DD
        const [existing] = await pool.query<RowDataPacket[]>(`
            SELECT id FROM l_bookings 
            WHERE student_id = ? AND tutor_id = ? 
            AND DATE(start_time) = DATE(?)
            AND status != 'canceled'
        `, [studentId, tutor_id, start_time]);

        if (existing.length > 0) {
            return res.status(400).json({ message: '您在这一天已经预约过该老师了，请选择其他日期或老师' });
        }

        const [result] = await pool.query<ResultSetHeader>(`
      INSERT INTO l_bookings 
      (student_id, tutor_id, subject, status, payment_status, amount, start_time, end_time, type, address, notes)
      VALUES (?, ?, ?, 'pending', 'unpaid', ?, ?, ?, ?, ?, ?)
    `, [studentId, tutor_id, subject, amount || 0, start_time, end_time, type, address, notes]);

        res.status(201).json({
            message: 'Booking created successfully',
            bookingId: result.insertId
        });
    } catch (error) {
        console.error('Create Booking error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const getMyBookings = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) return res.status(401).json({ message: 'Unauthorized' });

        const [bookings] = await pool.query<RowDataPacket[]>(`
      SELECT b.*, t.title as tutor_title, t.price_per_hour, u.name as tutor_name, u.avatar as tutor_image, u.gender as tutor_gender
      FROM l_bookings b
      JOIN l_tutors t ON b.tutor_id = t.id
      JOIN l_users u ON t.user_id = u.id
      WHERE b.student_id = ?
      ORDER BY b.created_at DESC
    `, [userId]);

        // Format for frontend
        const formattedBookings = bookings.map(b => ({
            id: b.id,
            tutorId: b.tutor_id,
            tutorName: b.tutor_name,
            tutorImage: b.tutor_image,
            tutorGender: b.tutor_gender,
            tutorTitle: b.tutor_title,
            subject: b.subject,
            status: b.status,
            paymentStatus: b.payment_status,
            amount: parseFloat(b.amount),
            startTime: b.start_time,
            endTime: b.end_time,
            type: b.type,
            address: b.address,
            notes: b.notes,
            createdAt: b.created_at
        }));

        res.json(formattedBookings);
    } catch (error) {
        console.error('Get Bookings error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const cancelBooking = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) return res.status(401).json({ message: 'Unauthorized' });

        const { id } = req.params;

        // 检查预约是否属于当前用户
        const [bookings] = await pool.query<RowDataPacket[]>(
            'SELECT * FROM l_bookings WHERE id = ? AND student_id = ?',
            [id, userId]
        );

        if (bookings.length === 0) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        const booking = bookings[0];

        // 只有 pending 状态的预约可以取消
        if (booking.status !== 'pending') {
            return res.status(400).json({ message: 'Only pending bookings can be canceled' });
        }

        await pool.query(
            'UPDATE l_bookings SET status = ? WHERE id = ?',
            ['canceled', id]
        );

        res.json({ message: 'Booking canceled successfully' });
    } catch (error) {
        console.error('Cancel Booking error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const payBooking = async (req: AuthRequest, res: Response) => {
    const connection = await pool.getConnection();
    try {
        const userId = req.user?.id;
        if (!userId) return res.status(401).json({ message: 'Unauthorized' });

        const { id } = req.params;

        await connection.beginTransaction();

        // 获取预约信息
        const [bookings] = await connection.query<RowDataPacket[]>(
            'SELECT * FROM l_bookings WHERE id = ? AND student_id = ?',
            [id, userId]
        );

        if (bookings.length === 0) {
            await connection.rollback();
            return res.status(404).json({ message: 'Booking not found' });
        }

        const booking = bookings[0];

        // 检查预约状态
        if (booking.status !== 'approved') {
            await connection.rollback();
            return res.status(400).json({ message: 'Only approved bookings can be paid' });
        }

        if (booking.payment_status === 'paid') {
            await connection.rollback();
            return res.status(400).json({ message: 'Booking already paid' });
        }

        // 获取用户余额
        const [users] = await connection.query<RowDataPacket[]>(
            'SELECT balance FROM l_users WHERE id = ?',
            [userId]
        );

        const userBalance = parseFloat(users[0].balance);
        const amount = parseFloat(booking.amount);

        if (userBalance < amount) {
            await connection.rollback();
            return res.status(400).json({ message: 'Insufficient balance' });
        }

        const newBalance = userBalance - amount;

        // 扣除余额
        await connection.query(
            'UPDATE l_users SET balance = ? WHERE id = ?',
            [newBalance, userId]
        );

        // 更新预约支付状态
        await connection.query(
            'UPDATE l_bookings SET payment_status = ? WHERE id = ?',
            ['paid', id]
        );

        // 插入账户流水记录
        await connection.query(
            `INSERT INTO l_account_log 
            (user_id, change_amount, before_balance, after_balance, biz_type, biz_id, remark)
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [
                userId,
                -amount,
                userBalance,
                newBalance,
                'BOOKING_PAYMENT',
                id,
                `支付预约课程费用 - 预约ID: ${id}`
            ]
        );

        await connection.commit();

        res.json({
            message: 'Payment successful',
            newBalance: newBalance
        });
    } catch (error) {
        await connection.rollback();
        console.error('Pay Booking error:', error);
        res.status(500).json({ message: 'Server error' });
    } finally {
        connection.release();
    }
};

export const getUserBalance = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) return res.status(401).json({ message: 'Unauthorized' });

        const [users] = await pool.query<RowDataPacket[]>(
            'SELECT balance FROM l_users WHERE id = ?',
            [userId]
        );

        if (users.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({ balance: parseFloat(users[0].balance) });
    } catch (error) {
        console.error('Get Balance error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const getAccountLogs = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) return res.status(401).json({ message: 'Unauthorized' });

        const [logs] = await pool.query<RowDataPacket[]>(
            `SELECT * FROM l_account_log 
            WHERE user_id = ? 
            ORDER BY created_at DESC 
            LIMIT 100`,
            [userId]
        );

        const formattedLogs = logs.map(log => ({
            id: log.id,
            changeAmount: parseFloat(log.change_amount),
            beforeBalance: parseFloat(log.before_balance),
            afterBalance: parseFloat(log.after_balance),
            bizType: log.biz_type,
            bizId: log.biz_id,
            remark: log.remark,
            createdAt: log.created_at
        }));

        res.json(formattedLogs);
    } catch (error) {
        console.error('Get Account Logs error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

