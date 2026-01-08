import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import {
    Users,
    GraduationCap,
    FileText,
    Trash2,
    TrendingUp,
    Award,
    RefreshCw,
    AlertCircle
} from 'lucide-react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Legend
} from 'recharts';

const ADMIN_API_BASE = 'http://localhost:9001/admin';

const COLORS = ['#22d3ee', '#06b6d4', '#0891b2', '#0e7490', '#155e75'];
const LEVEL_COLORS = {
    '1': '#22d3ee',
    '2': '#06b6d4',
    '3': '#0891b2',
    'Level 1': '#22d3ee',
    'Level 2': '#06b6d4',
    'Level 3': '#0891b2'
};

const AdminDashboard = () => {
    const { accessToken } = useAuth();
    const [stats, setStats] = useState({ totalStudents: 0, totalInstructors: 0, totalReports: 0 });
    const [analytics, setAnalytics] = useState({ reportsActivity: [], levelDistribution: [], gradingStats: { graded: 0, ungraded: 0 }, averageScore: 0 });
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [deleteConfirm, setDeleteConfirm] = useState(null);

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            const headers = { Authorization: `Bearer ${accessToken}` };

            const [statsRes, analyticsRes, usersRes] = await Promise.all([
                axios.get(`${ADMIN_API_BASE}/stats`, { headers }),
                axios.get(`${ADMIN_API_BASE}/analytics`, { headers }),
                axios.get(`${ADMIN_API_BASE}/users`, { headers })
            ]);

            if (statsRes.data.success) setStats(statsRes.data.data);
            if (analyticsRes.data.success) setAnalytics(analyticsRes.data.data);
            if (usersRes.data.success) setUsers(usersRes.data.data);
        } catch (err) {
            console.error('Failed to fetch admin data:', err);
            setError('Failed to load dashboard data. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [accessToken]);

    const handleDeleteUser = async (userId, userType) => {
        try {
            const headers = { Authorization: `Bearer ${accessToken}` };
            await axios.delete(`${ADMIN_API_BASE}/users/${userId}?userType=${userType}`, { headers });
            setDeleteConfirm(null);
            fetchData(); // Refresh data
        } catch (err) {
            console.error('Failed to delete user:', err);
            setError('Failed to delete user. Please try again.');
        }
    };

    // Prepare chart data
    const gradingChartData = [
        { name: 'Graded', value: analytics.gradingStats.graded, fill: '#22d3ee' },
        { name: 'Pending', value: analytics.gradingStats.ungraded, fill: '#374151' }
    ];

    const levelChartData = analytics.levelDistribution.map((item, index) => ({
        name: `Level ${item.level}`,
        value: item.count,
        fill: COLORS[index % COLORS.length]
    }));

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0a0f0f] p-6 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <RefreshCw className="w-8 h-8 text-cyan-400 animate-spin" />
                    <p className="text-gray-400">Loading dashboard data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0a0f0f] p-6">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
                        <p className="text-gray-400 text-sm">Platform overview and user management</p>
                    </div>
                    <button
                        onClick={fetchData}
                        className="flex items-center gap-2 px-4 py-2 bg-[#0d1717] border border-[#1a3333] rounded-lg text-gray-300 hover:text-cyan-400 hover:border-cyan-500/30 transition-colors"
                    >
                        <RefreshCw className="w-4 h-4" />
                        Refresh
                    </button>
                </div>

                {/* Error Alert */}
                {error && (
                    <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 flex items-center gap-3">
                        <AlertCircle className="w-5 h-5 text-red-400" />
                        <p className="text-red-400">{error}</p>
                    </div>
                )}

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-[#0d1717] border border-[#1a3333] rounded-xl p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-400 text-sm">Total Students</p>
                                <p className="text-3xl font-bold text-white mt-1">{stats.totalStudents}</p>
                            </div>
                            <div className="w-12 h-12 bg-cyan-500/10 rounded-xl flex items-center justify-center">
                                <GraduationCap className="w-6 h-6 text-cyan-400" />
                            </div>
                        </div>
                    </div>
                    <div className="bg-[#0d1717] border border-[#1a3333] rounded-xl p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-400 text-sm">Total Instructors</p>
                                <p className="text-3xl font-bold text-white mt-1">{stats.totalInstructors}</p>
                            </div>
                            <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center">
                                <Users className="w-6 h-6 text-purple-400" />
                            </div>
                        </div>
                    </div>
                    <div className="bg-[#0d1717] border border-[#1a3333] rounded-xl p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-400 text-sm">Total Reports</p>
                                <p className="text-3xl font-bold text-white mt-1">{stats.totalReports}</p>
                            </div>
                            <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center">
                                <FileText className="w-6 h-6 text-green-400" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Charts Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Reports Activity Chart */}
                    <div className="bg-[#0d1717] border border-[#1a3333] rounded-xl p-6">
                        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-cyan-400" />
                            Reports Activity (Last 7 Days)
                        </h3>
                        {analytics.reportsActivity.length > 0 ? (
                            <ResponsiveContainer width="100%" height={250}>
                                <BarChart data={analytics.reportsActivity}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#1a3333" />
                                    <XAxis
                                        dataKey="date"
                                        stroke="#6b7280"
                                        tick={{ fill: '#6b7280', fontSize: 12 }}
                                        tickFormatter={(value) => value.split('-').slice(1).join('/')}
                                    />
                                    <YAxis stroke="#6b7280" tick={{ fill: '#6b7280', fontSize: 12 }} />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: '#0d1717',
                                            border: '1px solid #1a3333',
                                            borderRadius: '8px',
                                            color: '#fff'
                                        }}
                                    />
                                    <Bar dataKey="count" fill="#22d3ee" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-[250px] flex items-center justify-center text-gray-500">
                                No report activity in the last 7 days
                            </div>
                        )}
                    </div>

                    {/* Grading & Level Distribution */}
                    <div className="bg-[#0d1717] border border-[#1a3333] rounded-xl p-6">
                        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                            <Award className="w-5 h-5 text-cyan-400" />
                            Grading Overview
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            {/* Grading Stats Pie */}
                            <div>
                                <p className="text-gray-400 text-sm mb-2 text-center">Grading Status</p>
                                <ResponsiveContainer width="100%" height={150}>
                                    <PieChart>
                                        <Pie
                                            data={gradingChartData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={35}
                                            outerRadius={55}
                                            paddingAngle={5}
                                            dataKey="value"
                                        >
                                            {gradingChartData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.fill} />
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: '#0d1717',
                                                border: '1px solid #1a3333',
                                                borderRadius: '8px',
                                                color: '#fff'
                                            }}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                                <div className="flex justify-center gap-4 mt-2">
                                    <div className="flex items-center gap-1">
                                        <div className="w-3 h-3 bg-cyan-400 rounded-full"></div>
                                        <span className="text-xs text-gray-400">Graded ({analytics.gradingStats.graded})</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <div className="w-3 h-3 bg-gray-600 rounded-full"></div>
                                        <span className="text-xs text-gray-400">Pending ({analytics.gradingStats.ungraded})</span>
                                    </div>
                                </div>
                            </div>

                            {/* Average Score Display */}
                            <div className="flex flex-col items-center justify-center">
                                <p className="text-gray-400 text-sm mb-2">Average Score</p>
                                <div className="relative w-24 h-24">
                                    <svg className="w-full h-full transform -rotate-90">
                                        <circle
                                            cx="48"
                                            cy="48"
                                            r="40"
                                            stroke="#1a3333"
                                            strokeWidth="8"
                                            fill="none"
                                        />
                                        <circle
                                            cx="48"
                                            cy="48"
                                            r="40"
                                            stroke="#22d3ee"
                                            strokeWidth="8"
                                            fill="none"
                                            strokeDasharray={`${(analytics.averageScore / 100) * 251} 251`}
                                            strokeLinecap="round"
                                        />
                                    </svg>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <span className="text-2xl font-bold text-white">{analytics.averageScore}</span>
                                    </div>
                                </div>
                                <p className="text-xs text-gray-500 mt-2">out of 100</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* User Management Table */}
                <div className="bg-[#0d1717] border border-[#1a3333] rounded-xl overflow-hidden">
                    <div className="p-6 border-b border-[#1a3333]">
                        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                            <Users className="w-5 h-5 text-cyan-400" />
                            User Management
                        </h3>
                        <p className="text-gray-400 text-sm mt-1">Manage all students and instructors</p>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-[#0a0f0f]">
                                <tr>
                                    <th className="text-left p-4 text-gray-400 text-sm font-medium">Username</th>
                                    <th className="text-left p-4 text-gray-400 text-sm font-medium">Email</th>
                                    <th className="text-left p-4 text-gray-400 text-sm font-medium">Role</th>
                                    <th className="text-left p-4 text-gray-400 text-sm font-medium">Score/Students</th>
                                    <th className="text-left p-4 text-gray-400 text-sm font-medium">Joined</th>
                                    <th className="text-center p-4 text-gray-400 text-sm font-medium">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#1a3333]">
                                {users.map((user) => (
                                    <tr key={user._id} className="hover:bg-[#0a0f0f]/50 transition-colors">
                                        <td className="p-4 text-white font-medium">{user.username}</td>
                                        <td className="p-4 text-gray-400">{user.email}</td>
                                        <td className="p-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${user.userType === 'instructor'
                                                    ? 'bg-purple-500/20 text-purple-400'
                                                    : 'bg-cyan-500/20 text-cyan-400'
                                                }`}>
                                                {user.userType}
                                            </span>
                                        </td>
                                        <td className="p-4 text-gray-400">
                                            {user.userType === 'student'
                                                ? `${user.totalScore || 0} pts`
                                                : `${user.assignedStudentsCount} students`
                                            }
                                        </td>
                                        <td className="p-4 text-gray-500 text-sm">
                                            {new Date(user.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="p-4 text-center">
                                            {deleteConfirm === user._id ? (
                                                <div className="flex items-center justify-center gap-2">
                                                    <button
                                                        onClick={() => handleDeleteUser(user._id, user.userType)}
                                                        className="px-3 py-1 bg-red-500 text-white text-xs rounded-lg hover:bg-red-600 transition-colors"
                                                    >
                                                        Confirm
                                                    </button>
                                                    <button
                                                        onClick={() => setDeleteConfirm(null)}
                                                        className="px-3 py-1 bg-gray-600 text-white text-xs rounded-lg hover:bg-gray-500 transition-colors"
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            ) : (
                                                <button
                                                    onClick={() => setDeleteConfirm(user._id)}
                                                    className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                                                    title="Delete User"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {users.length === 0 && (
                            <div className="p-8 text-center text-gray-500">
                                No users found
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
