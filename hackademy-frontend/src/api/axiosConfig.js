import axios from 'axios';

// Base URL configuration - Use live Vercel URL in production
const BASE_URL = 'https://hackademy-ztbw-khaled-ahmeds-projects-24f2398a.vercel.app';

// Main Application API - For Students & Instructors
export const mainApi = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Admin Panel API - For Admin Operations
// Both Main and Admin Panel live on the same domain on Vercel
export const adminApi = axios.create({
    baseURL: `${BASE_URL}/admin-api`,
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
