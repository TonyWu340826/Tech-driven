import { Response } from 'express';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
import pool from '../config/database';
import { AuthRequest, CreateBookingRequest } from '../types';

export const createBooking = async (req: AuthRequest, res: Response) => {
    try {
        const studentId = req.user?.id;
        if (!studentId) return res.status(401).json({ message: 'Unauthorized' });

        const { tutor_id, subject, start_time, end_time, type, notes } = req.body;

        const [result] = await pool.query<ResultSetHeader>(`
      INSERT INTO l_bookings 
      (student_id, tutor_id, subject, status, start_time, end_time, type, notes)
      VALUES (?, ?, ?, 'upcoming', ?, ?, ?, ?)
    `, [studentId, tutor_id, subject, start_time, end_time, type, notes]);

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
      SELECT b.*, t.title as tutor_title, u.name as tutor_name, u.avatar as tutor_image
      FROM l_bookings b
      JOIN l_tutors t ON b.tutor_id = t.id
      JOIN l_users u ON t.user_id = u.id
      WHERE b.student_id = ?
      ORDER BY b.start_time ASC
    `, [userId]);

        // Format for frontend
        const formattedBookings = bookings.map(b => ({
            id: b.id,
            tutorName: b.tutor_name,
            tutorImage: b.tutor_image,
            subject: b.subject,
            status: b.status,
            startTime: new Date(b.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            endTime: new Date(b.end_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            date: new Date(b.start_time).toISOString().split('T')[0],
            type: b.type
        }));

        res.json(formattedBookings);
    } catch (error) {
        console.error('Get Bookings error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
