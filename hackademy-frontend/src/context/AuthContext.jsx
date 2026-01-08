import { createContext, useContext, useState, useEffect } from 'react';
import { mainApi, adminApi } from '../api/axiosConfig';

const AuthContext = createContext(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [accessToken, setAccessToken] = useState(null);
    const [refreshToken, setRefreshToken] = useState(null);
    const [loading, setLoading] = useState(true);
    const [role, setRole] = useState(null); // 'student', 'instructor', 'admin'

    // Initialize from localStorage on mount
    useEffect(() => {
        const storedToken = localStorage.getItem('accessToken');
        const storedRefresh = localStorage.getItem('refreshToken');
        const storedUser = localStorage.getItem('user');
        const storedRole = localStorage.getItem('role');

        if (storedToken && storedUser) {
            setAccessToken(storedToken);
            setRefreshToken(storedRefresh);
            setUser(JSON.parse(storedUser));
            setRole(storedRole);
        }
        setLoading(false);
    }, []);

    // Login for Students/Instructors (Main App - Port 9999)
    const loginUser = async (email, password, userType) => {
        try {
            const response = await mainApi.post('/api/auth/login', {
                email,
                password,
                userType, // 'student' or 'instructor'
            });

            const { accessToken: token, refreshtoken, userType: returnedType } = response.data;

            // Store in state and localStorage
            setAccessToken(token);
            setRefreshToken(refreshtoken);
            setRole(returnedType);
            setUser({ email, userType: returnedType });

            localStorage.setItem('accessToken', token);
            localStorage.setItem('refreshToken', refreshtoken);
            localStorage.setItem('user', JSON.stringify({ email, userType: returnedType }));
            localStorage.setItem('role', returnedType);

            return { success: true, role: returnedType };
        } catch (error) {
            console.error('Login failed:', error);
            return {
                success: false,
                error: error.response?.data?.message || 'Login failed. Please try again.'
            };
        }
    };

    // Login for Admin (Admin Panel - Port 9001)
    const loginAdmin = async (email, password) => {
        try {
            const response = await adminApi.post('/admin/login', {
                email,
                password,
            });

            const { token } = response.data;

            setAccessToken(token);
            setRole('admin');
            setUser({ email, userType: 'admin' });

            localStorage.setItem('accessToken', token);
            localStorage.setItem('user', JSON.stringify({ email, userType: 'admin' }));
            localStorage.setItem('role', 'admin');

            return { success: true, role: 'admin' };
        } catch (error) {
            console.error('Admin login failed:', error);
            return {
                success: false,
                error: error.response?.data?.message || 'Admin login failed. Please try again.'
            };
        }
    };

    // Logout
    const logout = async () => {
        try {
            // Call logout API if not admin
            if (role !== 'admin' && accessToken && refreshToken) {
                await mainApi.post('/api/auth/logout', null, {
                    headers: {
                        accessToken,
                        refreshtoken: refreshToken,
                    },
                });
            }
        } catch (error) {
            console.error('Logout API error:', error);
        } finally {
            // Clear state and localStorage
            setUser(null);
            setAccessToken(null);
            setRefreshToken(null);
            setRole(null);
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('user');
            localStorage.removeItem('role');
        }
    };

    const value = {
        user,
        accessToken,
        refreshToken,
        role,
        loading,
        isAuthenticated: !!accessToken,
        isStudent: role === 'student',
        isInstructor: role === 'instructor',
        isAdmin: role === 'admin',
        loginUser,
        loginAdmin,
        logout,
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
