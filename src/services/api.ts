import axios from 'axios';

const api = axios.create({
    baseURL: '/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor to include the auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor to handle 401s (optional logout)
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // Token expired or invalid
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            // We might want to redirect to login here, or let the App component handle it
        }
        return Promise.reject(error);
    }
);

export const authService = {
    login: async (email: string, password: string) => {
        const response = await api.post('/auth/login', { email, password });
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        return response.data;
    },
    register: async (name: string, email: string, password: string) => {
        const response = await api.post('/auth/register', { name, email, password });
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        return response.data;
    },
    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },
    getCurrentUser: () => {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    }
};

export const tutorService = {
    getAll: async (filters: any = {}) => {
        const response = await api.get('/tutors', { params: filters });
        return response.data;
    },
    getById: async (id: string) => {
        const response = await api.get(`/tutors/${id}`);
        return response.data;
    }
};

export const bookingService = {
    create: async (data: any) => {
        const response = await api.post('/bookings', data);
        return response.data;
    },
    getMyBookings: async () => {
        const response = await api.get('/bookings');
        return response.data;
    },
    cancel: async (id: number) => {
        const response = await api.put(`/bookings/${id}/cancel`);
        return response.data;
    },
    pay: async (id: number) => {
        const response = await api.post(`/bookings/${id}/pay`);
        return response.data;
    }
};

export const userService = {
    getBalance: async () => {
        const response = await api.get('/bookings/user/balance');
        return response.data;
    },
    getAccountLogs: async () => {
        const response = await api.get('/bookings/user/account-logs');
        return response.data;
    }
};

export default api;
