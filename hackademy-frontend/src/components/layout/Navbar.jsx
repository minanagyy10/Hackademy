import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
    Home,
    FileText,
    Send,
    User,
    LogOut,
    Trophy,
    Users,
    GraduationCap,
    Shield,
    Award
} from 'lucide-react';

const Navbar = () => {
    const { user, role, logout, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    const isActive = (path) => location.pathname === path;

    // Different nav items based on role
    const getNavItems = () => {
        if (role === 'student') {
            return [
                { path: '/student/dashboard', label: 'Home', icon: Home },
                { path: '/practice', label: 'Practice', icon: GraduationCap },
                { path: '/student/submit-report', label: 'Send Report', icon: Send },
                { path: '/leaderboard', label: 'Leaderboard', icon: Trophy },
                { path: '/student/badges', label: 'Badges', icon: Award },
            ];
        } else if (role === 'instructor') {
            return [
                { path: '/instructor/dashboard', label: 'Home', icon: Home },
                { path: '/instructor/students', label: 'My Students', icon: Users },
                { path: '/instructor/reports', label: 'Reports', icon: FileText },
                { path: '/leaderboard', label: 'Leaderboard', icon: Trophy },
            ];
        } else if (role === 'admin') {
            return [
                { path: '/admin/dashboard', label: 'Dashboard', icon: Home },
                { path: '/admin/register', label: 'Register User', icon: User },
            ];
        }
        return [];
    };

    if (!isAuthenticated) return null;

    return (
        <nav className="bg-[#0a0f0f]/95 backdrop-blur-md border-b border-cyan-900/30 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 group">
                        <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-lg flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
                            <Shield className="w-4 h-4 text-white" />
                        </div>
                        <h1 className="text-xl font-bold">
                            <span className="text-cyan-400">H</span>
                            <span className="text-white">ackademy</span>
                        </h1>
                    </Link>

                    {/* Center Navigation */}
                    <div className="hidden md:flex items-center gap-1 bg-[#0d1717]/80 rounded-full px-2 py-1 border border-cyan-900/20">
                        {getNavItems().map((item) => {
                            const Icon = item.icon;
                            const active = isActive(item.path);
                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={`relative flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${active
                                        ? 'bg-gradient-to-r from-cyan-500 to-cyan-400 text-[#0a0f0f] shadow-lg shadow-cyan-500/20'
                                        : 'text-gray-400 hover:text-cyan-400'
                                        }`}
                                >
                                    <Icon className={`w-4 h-4 ${active ? '' : 'group-hover:text-cyan-400'}`} />
                                    {item.label}
                                </Link>
                            );
                        })}
                    </div>

                    {/* Right Side - Profile & Actions */}
                    <div className="flex items-center gap-3">
                        {/* User Badge */}
                        <div className="flex items-center gap-2 px-3 py-2 bg-[#0d1717]/80 rounded-full border border-cyan-900/30 hover:border-cyan-500/30 transition-colors duration-300">
                            <div className="w-8 h-8 bg-gradient-to-br from-cyan-400/20 to-cyan-600/20 rounded-full flex items-center justify-center">
                                <User className="w-4 h-4 text-cyan-400" />
                            </div>
                            <span className="text-sm text-gray-300 capitalize hidden sm:block font-medium">
                                {role}
                            </span>
                        </div>

                        {/* Logout Button */}
                        <button
                            onClick={handleLogout}
                            className="p-2.5 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-full transition-all duration-300"
                            title="Logout"
                        >
                            <LogOut className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Navigation */}
            <div className="md:hidden flex overflow-x-auto gap-2 px-4 pb-3 scrollbar-hide">
                {getNavItems().map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.path);
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-300 ${active
                                ? 'bg-gradient-to-r from-cyan-500 to-cyan-400 text-[#0a0f0f] shadow-lg shadow-cyan-500/20'
                                : 'bg-[#0d1717] text-gray-400 border border-cyan-900/20 hover:border-cyan-500/30'
                                }`}
                        >
                            <Icon className="w-4 h-4" />
                            {item.label}
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
};

export default Navbar;
