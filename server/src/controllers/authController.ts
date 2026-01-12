import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
import pool from '../config/database';
import { generateToken } from '../utils/token';
import { RegisterRequest, LoginRequest, AuthResponse, User, AuthRequest } from '../types';

export const register = async (req: Request<{}, {}, RegisterRequest>, res: Response) => {
    try {
        const { name, email, password } = req.body;

        // Check if user exists
        const [existingUsers] = await pool.query<RowDataPacket[]>('SELECT * FROM l_users WHERE email = ?', [email]);
        if (existingUsers.length > 0) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        const [result] = await pool.query<ResultSetHeader>(
            'INSERT INTO l_users (name, email, password) VALUES (?, ?, ?)',
            [name, email, hashedPassword]
        );

        const newUser: User = {
            id: result.insertId,
            name,
            email,
            password: hashedPassword,
            role: 'student', // Default role for now
            created_at: new Date(),
            updated_at: new Date()
        };

        // Generate token
        const token = generateToken(newUser);

        const response: AuthResponse = {
            token,
            user: {
                id: newUser.id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role,
                created_at: newUser.created_at,
                updated_at: newUser.updated_at
            }
        };

        res.status(201).json(response);
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const login = async (req: Request<{}, {}, LoginRequest>, res: Response) => {
    try {
        const { email, password } = req.body;

        // Find user
        const [users] = await pool.query<RowDataPacket[]>('SELECT * FROM l_users WHERE email = ?', [email]);
        const user = users[0] as User;

        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Generate token
        const token = generateToken(user);

        const response: AuthResponse = {
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                avatar: user.avatar,
                role: user.role,
                created_at: user.created_at,
                updated_at: user.updated_at
            }
        };

        res.json(response);
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const getMe = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: 'Not authenticated' });
        }

        const [users] = await pool.query<RowDataPacket[]>('SELECT id, name, email, avatar, role, bio, phone, created_at FROM l_users WHERE id = ?', [userId]);
        const user = users[0];

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        console.error('Get Me error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
