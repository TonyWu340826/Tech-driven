import { Response } from 'express';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
import pool from '../config/database';
import { AuthRequest } from '../types';

export const getConversations = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) return res.status(401).json({ message: 'Unauthorized' });

        // This query is a bit complex as it needs to join user info for the OTHER participant
        // Assuming the user is a student for now. In a real app, we'd check role.
        // If student -> get tutor info. If tutor -> get student info.

        // Simplification: We will just get conversations where current user is student
        const [conversations] = await pool.query<RowDataPacket[]>(`
      SELECT c.*, 
             u.name as tutor_name, 
             u.avatar as tutor_image,
             (SELECT message_text FROM l_messages WHERE conversation_id = c.id ORDER BY created_at DESC LIMIT 1) as last_message,
             (SELECT created_at FROM l_messages WHERE conversation_id = c.id ORDER BY created_at DESC LIMIT 1) as last_message_time,
             (SELECT COUNT(*) FROM l_messages WHERE conversation_id = c.id AND is_read = FALSE AND sender_id != ?) as unread_count
      FROM l_conversations c
      JOIN l_tutors t ON c.tutor_id = t.id
      JOIN l_users u ON t.user_id = u.id
      WHERE c.student_id = ?
      ORDER BY last_message_time DESC
    `, [userId, userId]);

        const formatted = conversations.map(c => ({
            id: c.id,
            tutorId: c.tutor_id,
            tutorName: c.tutor_name,
            tutorImage: c.tutor_image,
            lastMessage: c.last_message || '',
            lastMessageTime: c.last_message_time,
            unreadCount: c.unread_count,
            isOnline: false // Mock for now
        }));

        res.json(formatted);
    } catch (error) {
        console.error('Get Conversations error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const getMessages = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.id;
        const { conversationId } = req.params;

        const [messages] = await pool.query<RowDataPacket[]>(`
      SELECT * FROM l_messages 
      WHERE conversation_id = ?
      ORDER BY created_at ASC
    `, [conversationId]);

        const formatted = messages.map(m => ({
            id: m.id,
            senderId: m.sender_id === userId ? 'me' : String(m.sender_id),
            text: m.message_text,
            timestamp: new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            type: m.message_type
        }));

        res.json(formatted);
    } catch (error) {
        console.error('Get Messages error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const sendMessage = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) return res.status(401).json({ message: 'Unauthorized' });

        const { conversationId } = req.params;
        const { text, type = 'text' } = req.body;

        await pool.query(
            'INSERT INTO l_messages (conversation_id, sender_id, message_text, message_type) VALUES (?, ?, ?, ?)',
            [conversationId, userId, text, type]
        );

        // Update conversation timestamp
        await pool.query(
            'UPDATE l_conversations SET last_message_at = CURRENT_TIMESTAMP WHERE id = ?',
            [conversationId]
        );

        res.status(201).json({ message: 'Message sent' });
    } catch (error) {
        console.error('Send Message error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
