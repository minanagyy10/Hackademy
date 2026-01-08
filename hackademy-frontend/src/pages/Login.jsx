import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shield, User, GraduationCap, Lock, Mail, AlertCircle, Loader2 } from 'lucide-react';

const Login = () => {
    const navigate = useNavigate();
    const { loginUser, loginAdmin } = useAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [userType, setUserType] = useState('student'); // 'student', 'instructor', 'admin'
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            let result;

            if (userType === 'admin') {
                result = await loginAdmin(email, password);
            } else {
                result = await loginUser(email, password, userType);
            }

            if (result.success) {
                // Redirect based on role
                switch (result.role) {
                    case 'student':
                        navigate('/student/dashboard');
                        break;
                    case 'instructor':
                        navigate('/instructor/dashboard');
                        break;
                    case 'admin':
                        navigate('/admin/dashboard');
                        break;
                    default:
                        navigate('/');
                }
            } else {
                setError(result.error);
            }
        } catch (err) {
            setError('An unexpected error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const getUserTypeIcon = () => {
        switch (userType) {
            case 'student':
                return <GraduationCap className="w-5 h-5" />;
            case 'instructor':
                return <User className="w-5 h-5" />;
            case 'admin':
                return <Shield className="w-5 h-5" />;
            default:
                return <User className="w-5 h-5" />;
        }
    };

    return (
        <div className="min-h-screen bg-[#0a0f0f] flex items-center justify-center px-4">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold">
                        <span className="text-cyan-400">H</span>
                        <span className="text-white">ackademy</span>
                    </h1>
                    <p className="text-gray-400 mt-2">Learn To Hack || Hack To Learn</p>
                </div>

                {/* Login Card */}
                <div className="bg-[#0d1717] border border-[#1a3333] rounded-xl p-8 shadow-lg">
                    <h2 className="text-xl font-semibold text-white text-center mb-6">
                        Welcome Back
                    </h2>

                    {/* User Type Selector */}
                    <div className="flex gap-2 mb-6 p-1 bg-[#0a0f0f] rounded-lg">
                        {['student', 'instructor', 'admin'].map((type) => (
                            <button
                                key={type}
                                type="button"
                                onClick={() => setUserType(type)}
                                className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all capitalize ${userType === type
                                        ? 'bg-cyan-400 text-[#0a0f0f]'
                                        : 'text-gray-400 hover:text-white'
                                    }`}
                            >
                                {type}
                            </button>
                        ))}
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 rounded-lg flex items-center gap-2 text-red-400">
                            <AlertCircle className="w-5 h-5 flex-shrink-0" />
                            <span className="text-sm">{error}</span>
                        </div>
                    )}

                    {/* Login Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Email Field */}
                        <div>
                            <label className="block text-sm text-gray-400 mb-1.5">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter your email"
                                    required
                                    className="w-full pl-10 pr-4 py-3 bg-[#0a0f0f] border border-[#1a3333] rounded-lg text-white placeholder-gray-500 focus:border-cyan-400 focus:outline-none transition-colors"
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div>
                            <label className="block text-sm text-gray-400 mb-1.5">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter your password"
                                    required
                                    className="w-full pl-10 pr-4 py-3 bg-[#0a0f0f] border border-[#1a3333] rounded-lg text-white placeholder-gray-500 focus:border-cyan-400 focus:outline-none transition-colors"
                                />
                            </div>
                        </div>

                        {/* Login Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 bg-cyan-400 hover:bg-cyan-500 text-[#0a0f0f] font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Signing in...
                                </>
                            ) : (
                                <>
                                    {getUserTypeIcon()}
                                    Sign in as {userType.charAt(0).toUpperCase() + userType.slice(1)}
                                </>
                            )}
                        </button>
                    </form>

                    {/* Info Text */}
                    <p className="text-center text-gray-500 text-sm mt-6">
                        {userType === 'admin'
                            ? 'Admin access is restricted to authorized personnel.'
                            : 'Contact your administrator if you need an account.'}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
