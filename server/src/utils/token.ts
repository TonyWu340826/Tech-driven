import jwt from 'jsonwebtoken';
import { User } from '../types';

export const generateToken = (user: User): string => {
    const options: jwt.SignOptions = {
        expiresIn: (process.env.JWT_EXPIRES_IN || '7d') as any
    };

    return jwt.sign(
        {
            id: user.id,
            email: user.email,
            role: user.role
        },
        process.env.JWT_SECRET as string,
        options
    );
};
