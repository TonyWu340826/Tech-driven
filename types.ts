export interface Tutor {
  id: string;
  name: string;
  title: string;
  price: number;
  rating: number;
  reviewCount: number;
  image: string;
  verified: boolean;
  tags: string[]; // e.g. "Online", "In-person"
  subject: string;
  gender?: 'male' | 'female' | 'other';
  distance?: string; // For discovery list
  bio?: string;
  certifications?: Certification[];
  reviews?: Review[];
}

export interface Certification {
  id: string;
  title: string;
  issuer: string;
  icon: string;
  colorClass: string;
}

export interface Review {
  id: string;
  author: string;
  avatar: string;
  rating: number;
  content: string;
  date: string;
}

export interface ScheduleItem {
  id: string;
  tutorName: string;
  tutorImage: string;
  subject: string;
  status: 'upcoming' | 'completed' | 'canceled';
  startTime: string; // "15:30"
  endTime: string; // "16:30"
  date: string; // "2023-10-24"
  type: 'online' | 'in-person';
  label?: string; // "10 mins left"
}

export interface Message {
  id: string;
  senderId: string; // 'me' or tutorId
  text: string;
  timestamp: string;
  type: 'text' | 'image';
}

export interface Conversation {
  id: string;
  tutorId: string;
  tutorName: string;
  tutorImage: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  isOnline: boolean;
  messages: Message[];
}

export type ViewState = 'LOGIN' | 'REGISTER' | 'HOME' | 'DISCOVERY' | 'SCHEDULE' | 'PROFILE' | 'TUTOR_DETAIL' | 'BOOKING' | 'MESSAGES' | 'CHAT_DETAIL' | 'CLASSROOM' | 'PERSONAL_INFO' | 'FAVORITES' | 'MY_BOOKINGS' | 'ACCOUNT_LOGS' | 'COMPLETED_CLASSES';