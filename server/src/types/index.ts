import { Request } from 'express';

// User related types
export interface User {
    id: number;
    name: string;
    email: string;
    password: string;
    avatar?: string;
    phone?: string;
    bio?: string;
    role: 'student' | 'tutor' | 'admin';
    created_at: Date;
    updated_at: Date;
}

export interface UserResponse extends Omit<User, 'password'> { }

export interface Tutor {
    id: number;
    user_id: number;
    title: string;
    price_per_hour: number;
    rating: number;
    review_count: number;
    verified: boolean;
    subject: string;
    bio?: string;
    created_at: Date;
    updated_at: Date;
}

export interface TutorWithUser extends Tutor {
    name: string;
    email: string;
    avatar?: string;
    tags: string[];
}

export interface Certification {
    id: number;
    tutor_id: number;
    title: string;
    issuer: string;
    icon: string;
    color_class: string;
    created_at: Date;
}

export interface Review {
    id: number;
    tutor_id: number;
    user_id: number;
    rating: number;
    content: string;
    created_at: Date;
    updated_at: Date;
    author?: string;
    avatar?: string;
}

export interface Booking {
    id: number;
    student_id: number;
    tutor_id: number;
    subject: string;
    status: 'upcoming' | 'completed' | 'canceled';
    start_time: Date;
    end_time: Date;
    type: 'online' | 'in-person';
    notes?: string;
    created_at: Date;
    updated_at: Date;
}

export interface BookingWithDetails extends Booking {
    tutor_name: string;
    tutor_image?: string;
    student_name: string;
}

export interface Conversation {
    id: number;
    student_id: number;
    tutor_id: number;
    last_message_at: Date;
    created_at: Date;
}

export interface ConversationWithDetails extends Conversation {
    tutor_name: string;
    tutor_image?: string;
    last_message: string;
    unread_count: number;
    is_online: boolean;
}

export interface Message {
    id: number;
    conversation_id: number;
    sender_id: number;
    message_text: string;
    message_type: 'text' | 'image';
    is_read: boolean;
    created_at: Date;
}

export interface Favorite {
    id: number;
    user_id: number;
    tutor_id: number;
    created_at: Date;
}

// Request types with authenticated user
export interface AuthRequest extends Request {
    user?: {
        id: number;
        email: string;
        role: string;
    };
}

// API Request/Response types
export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    name: string;
    email: string;
    password: string;
}

export interface AuthResponse {
    token: string;
    user: UserResponse;
}

export interface CreateBookingRequest {
    tutor_id: number;
    subject: string;
    start_time: string;
    end_time: string;
    type: 'online' | 'in-person';
    notes?: string;
}

export interface SendMessageRequest {
    conversation_id?: number;
    tutor_id?: number;
    message_text: string;
    message_type?: 'text' | 'image';
}

export interface CreateReviewRequest {
    tutor_id: number;
    rating: number;
    content: string;
}
