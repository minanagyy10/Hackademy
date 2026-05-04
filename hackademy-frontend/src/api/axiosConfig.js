import axios from 'axios';

// Main Application API (Port 9999) - For Students & Instructors
export const mainApi = axios.create({
    baseURL: 'http://localhost:9999',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Admin Panel API (Port 9001) - For Admin Operations
export const adminApi = axios.create({
    baseURL: 'http://localhost:9001',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request Interceptor - Attach Authorization Header
const attachAuthToken = (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
};

// Error Interceptor
const handleError = (error) => {
    if (error.response?.status === 401) {
        // Token expired or invalid - redirect to login
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        window.location.href = '/login';
    }
    return Promise.reject(error);
};

// Apply interceptors to both instances
mainApi.interceptors.request.use(attachAuthToken, Promise.reject);
mainApi.interceptors.response.use((response) => response, handleError);

adminApi.interceptors.request.use(attachAuthToken, Promise.reject);
adminApi.interceptors.response.use((response) => response, handleError);

export default mainApi;
