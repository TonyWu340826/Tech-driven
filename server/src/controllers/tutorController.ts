import { Request, Response } from 'express';
import { RowDataPacket } from 'mysql2';
import pool from '../config/database';
import { TutorWithUser } from '../types';

export const getAllTutors = async (req: Request, res: Response) => {
    try {
        const { subject, type, minPrice, maxPrice } = req.query;

        let query = `
      SELECT t.*, u.name, u.email, u.avatar, u.gender 
      FROM l_tutors t 
      JOIN l_users u ON t.user_id = u.id
    `;

        // Build where clause
        const conditions = [];
        const params = [];

        if (subject) {
            conditions.push('t.subject = ?');
            params.push(subject);
        }

        if (minPrice) {
            conditions.push('t.price_per_hour >= ?');
            params.push(minPrice);
        }

        if (maxPrice) {
            conditions.push('t.price_per_hour <= ?');
            params.push(maxPrice);
        }

        if (conditions.length > 0) {
            query += ' WHERE ' + conditions.join(' AND ');
        }

        const [tutors] = await pool.query<RowDataPacket[]>(query, params);

        // For each tutor, get tags
        const tutorsWithTags = await Promise.all(tutors.map(async (tutor) => {
            const [tags] = await pool.query<RowDataPacket[]>(
                'SELECT tag FROM l_tutor_tags WHERE tutor_id = ?',
                [tutor.id]
            );
            return {
                ...tutor,
                tags: tags.map(tag => tag.tag)
            };
        }));

        res.json(tutorsWithTags);
    } catch (error) {
        console.error('Get Tutors error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const getTutorById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        // Get tutor basic info with user info
        const [tutors] = await pool.query<RowDataPacket[]>(`
      SELECT t.*, u.name, u.email, u.avatar, u.gender 
      FROM l_tutors t 
      JOIN l_users u ON t.user_id = u.id
      WHERE t.id = ?
    `, [id]);

        if (tutors.length === 0) {
            return res.status(404).json({ message: 'Tutor not found' });
        }

        const tutor = tutors[0];

        // Get tags
        const [tags] = await pool.query<RowDataPacket[]>(
            'SELECT tag FROM l_tutor_tags WHERE tutor_id = ?',
            [id]
        );

        // Get certifications
        const [certifications] = await pool.query<RowDataPacket[]>(
            'SELECT * FROM l_certifications WHERE tutor_id = ?',
            [id]
        );

        // Get reviews
        const [reviews] = await pool.query<RowDataPacket[]>(`
      SELECT r.*, u.name as author, u.avatar 
      FROM l_reviews r 
      JOIN l_users u ON r.user_id = u.id
      WHERE r.tutor_id = ?
      ORDER BY r.created_at DESC
    `, [id]);

        const fullTutor = {
            ...tutor,
            tags: tags.map(t => t.tag),
            certifications,
            reviews
        };

        res.json(fullTutor);
    } catch (error) {
        console.error('Get Tutor Detail error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
