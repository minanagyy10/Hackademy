import { useState, useEffect } from 'react';
import { mainApi } from '../../api/axiosConfig';
import { useAuth } from '../../context/AuthContext';
import {
    Users,
    FileText,
    CheckCircle,
    Clock,
    AlertCircle,
    Loader2,
    Search,
    UserPlus,
    History,
    ClipboardList,
    Star,
    Edit3
} from 'lucide-react';
import GradingModal from '../../components/modals/GradingModal';

const InstructorDashboard = () => {
    const { user } = useAuth();
    const [students, setStudents] = useState([]);
    const [allStudents, setAllStudents] = useState([]);
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [addStudentEmail, setAddStudentEmail] = useState('');
    const [addStatus, setAddStatus] = useState({ type: '', message: '' });
    const [activeTab, setActiveTab] = useState('pending'); // 'pending' or 'history'
    const [selectedReport, setSelectedReport] = useState(null); // For GradingModal

    useEffect(() => {
        fetchDashboardData();
        fetchAllStudents();
    }, []);

    const fetchDashboardData = async () => {
        setLoading(true);
        setError('');
        try {
            const [studentsRes, reportsRes] = await Promise.all([
                mainApi.get('/api/instructors/students'),
                mainApi.get('/api/instructors/reports')
            ]);
            setStudents(studentsRes.data.students || []);
            setReports(reportsRes.data.reports || []);
        } catch (err) {
            console.error('Error fetching dashboard data:', err);
            setError('Failed to load dashboard data.');
        } finally {
            setLoading(false);
        }
    };

    const fetchAllStudents = async () => {
        try {
            const res = await mainApi.get('/api/students');
            setAllStudents(res.data.students || []);
        } catch (err) {
            console.error('Error fetching all students:', err);
        }
    };

    const handleAddStudentByEmail = async (e) => {
        e.preventDefault();
        const email = addStudentEmail.trim().toLowerCase();
        if (!email) {
            setAddStatus({ type: 'error', message: 'Please enter a student email' });
            return;
        }

        setAddStatus({ type: 'loading', message: 'Searching student...' });

        const student = allStudents.find(s => s.email?.toLowerCase() === email);
        if (!student) {
            setAddStatus({ type: 'error', message: 'Student email not found. Please check the email and try again.' });
            return;
        }

        const isAlreadyAssigned = students.some(s => s._id === student._id);
        if (isAlreadyAssigned) {
            setAddStatus({ type: 'error', message: 'This student is already assigned to you.' });
            return;
        }

        try {
            await mainApi.post('/api/instructors/assign', { studentId: student._id });
            setAddStatus({ type: 'success', message: `Successfully assigned ${student.username || student.email}!` });
            setAddStudentEmail('');
            fetchDashboardData();
            setTimeout(() => setAddStatus({ type: '', message: '' }), 3000);
        } catch (err) {
            console.error('Error assigning student:', err);
            setAddStatus({ type: 'error', message: err.response?.data?.message || 'Failed to assign student. Please try again.' });
        }
    };

    const pendingReports = reports.filter(r => !r.score);
    const gradedReports = reports.filter(r => r.score);

    if (loading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 text-cyan-400 animate-spin mx-auto mb-4" />
                    <p className="text-gray-400">Loading your instructor dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-[#0d1717] p-6 rounded-2xl border border-[#1a3333]">
                <div>
                    <h1 className="text-2xl font-bold text-white mb-1">Welcome, Instructor {user?.username}</h1>
                    <p className="text-gray-400 text-sm">Manage your students and review their vulnerability reports.</p>
                </div>

                {/* Add Student Quick Form */}
                <form onSubmit={handleAddStudentByEmail} className="flex flex-col sm:flex-row gap-2 relative">
                    <div className="relative group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-cyan-400 transition-colors" />
                        <input
                            type="email"
                            placeholder="Student email (e.g., student1@test.com)"
                            value={addStudentEmail}
                            onChange={(e) => {
                                setAddStudentEmail(e.target.value);
                                setAddStatus({ type: '', message: '' });
                            }}
                            className="w-full sm:w-80 pl-10 pr-4 py-2 bg-[#0a0f0f] border border-[#1a3333] rounded-lg text-white placeholder-gray-600 focus:border-cyan-400 focus:outline-none transition-all"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={addStatus.type === 'loading'}
                        className="px-4 py-2 bg-cyan-400 hover:bg-cyan-500 text-[#0a0f0f] font-bold rounded-lg transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
                    >
                        {addStatus.type === 'loading' ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Adding...
                            </>
                        ) : (
                            <>
                                <UserPlus className="w-4 h-4" />
                                Add Student
                            </>
                        )}
                    </button>
                    {addStatus.message && (
                        <div className={`absolute mt-12 px-3 py-1 rounded text-xs font-medium z-10 ${addStatus.type === 'success' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                                addStatus.type === 'error' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                                    'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                            }`}>
                            {addStatus.message}
                        </div>
                    )}
                </form>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-[#0d1717] border border-[#1a3333] rounded-xl p-4 flex items-center gap-4">
                    <div className="w-12 h-12 bg-cyan-400/20 rounded-full flex items-center justify-center">
                        <Users className="w-6 h-6 text-cyan-400" />
                    </div>
                    <div>
                        <p className="text-gray-400 text-sm">My Students</p>
                        <p className="text-2xl font-bold text-white">{students.length}</p>
                    </div>
                </div>

                <div className="bg-[#0d1717] border border-[#1a3333] rounded-xl p-4 flex items-center gap-4">
                    <div className="w-12 h-12 bg-yellow-400/20 rounded-full flex items-center justify-center">
                        <Clock className="w-6 h-6 text-yellow-400" />
                    </div>
                    <div>
                        <p className="text-gray-400 text-sm">Pending Reviews</p>
                        <p className="text-2xl font-bold text-white">{pendingReports.length}</p>
                    </div>
                </div>

                <div className="bg-[#0d1717] border border-[#1a3333] rounded-xl p-4 flex items-center gap-4">
                    <div className="w-12 h-12 bg-green-400/20 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-6 h-6 text-green-400" />
                    </div>
                    <div>
                        <p className="text-gray-400 text-sm">Grading History</p>
                        <p className="text-2xl font-bold text-white">{gradedReports.length}</p>
                    </div>
                </div>
            </div>

            {/* Error State */}
            {error && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg flex items-center gap-3 text-red-400">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <span>{error}</span>
                </div>
            )}

            {/* Main Tabs and Content */}
            <div className="bg-[#0d1717] border border-[#1a3333] rounded-2xl overflow-hidden">
                {/* Tab Navigation */}
                <div className="flex border-b border-[#1a3333] bg-[#0a0f0f]">
                    <button
                        onClick={() => setActiveTab('pending')}
                        className={`px-8 py-4 text-sm font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${activeTab === 'pending'
                                ? 'text-cyan-400 border-b-2 border-cyan-400 bg-cyan-400/5'
                                : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'
                            }`}
                    >
                        <ClipboardList className="w-4 h-4" />
                        Pending Reviews ({pendingReports.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('history')}
                        className={`px-8 py-4 text-sm font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${activeTab === 'history'
                                ? 'text-cyan-400 border-b-2 border-cyan-400 bg-cyan-400/5'
                                : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'
                            }`}
                    >
                        <History className="w-4 h-4" />
                        Grading History ({gradedReports.length})
                    </button>
                </div>

                {/* Tab Content */}
                <div className="p-6">
                    {activeTab === 'pending' ? (
                        <div className="space-y-4">
                            {pendingReports.length === 0 ? (
                                <div className="text-center py-12 text-gray-500 italic">
                                    No reports waiting for review. Good job!
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {pendingReports.map(report => (
                                        <div key={report._id} className="bg-[#0a0f0f] border border-[#1a3333] rounded-xl p-5 hover:border-cyan-400/30 transition-all flex flex-col h-full">
                                            <div className="flex justify-between items-start mb-4">
                                                <div>
                                                    <h3 className="text-white font-bold text-lg capitalize">{report.title}</h3>
                                                    <p className="text-cyan-400 text-sm">From: {report.student?.username || 'Unknown Student'}</p>
                                                </div>
                                                <span className="px-2 py-1 bg-yellow-400/10 text-yellow-400 border border-yellow-400/20 rounded text-[10px] font-black uppercase">
                                                    LV.{report.level}
                                                </span>
                                            </div>
                                            <div className="bg-black/50 border border-white/5 rounded-lg p-3 text-xs text-gray-400 font-mono mb-6 flex-grow overflow-hidden text-ellipsis line-clamp-3">
                                                {report.content}
                                            </div>
                                            <button
                                                onClick={() => setSelectedReport(report)}
                                                className="w-full py-3 bg-cyan-400/10 hover:bg-cyan-400 hover:text-[#0a0f0f] text-cyan-400 font-bold rounded-lg transition-all border border-cyan-400/20"
                                            >
                                                Start Grading
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {gradedReports.length === 0 ? (
                                <div className="text-center py-12 text-gray-500 italic">
                                    No history of graded reports yet.
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full border-collapse">
                                        <thead>
                                            <tr className="border-b border-[#1a3333] text-left">
                                                <th className="py-4 px-2 text-xs font-bold text-gray-500 uppercase tracking-wider">Student</th>
                                                <th className="py-4 px-2 text-xs font-bold text-gray-500 uppercase tracking-wider">Report</th>
                                                <th className="py-4 px-2 text-xs font-bold text-gray-500 uppercase tracking-wider">Score</th>
                                                <th className="py-4 px-2 text-xs font-bold text-gray-500 uppercase tracking-wider">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {gradedReports.map(report => (
                                                <tr key={report._id} className="border-b border-[#1a3333] hover:bg-white/2 transition-colors group">
                                                    <td className="py-4 px-2">
                                                        <div className="text-white font-medium">{report.student?.username || 'Student'}</div>
                                                        <div className="text-gray-500 text-[10px]">{report.student?.email}</div>
                                                    </td>
                                                    <td className="py-4 px-2">
                                                        <div className="text-gray-300 capitalize">{report.title}</div>
                                                        <div className="text-[10px] text-gray-500">LV.{report.level} • {new Date(report.updatedAt).toLocaleDateString()}</div>
                                                    </td>
                                                    <td className="py-4 px-2">
                                                        <div className="flex items-center gap-1">
                                                            <Star className="w-3 h-3 text-yellow-400" />
                                                            <span className="text-white font-black">{typeof report.score === 'object' ? report.score.score : report.score}</span>
                                                            <span className="text-gray-500 text-xs">/100</span>
                                                        </div>
                                                    </td>
                                                    <td className="py-4 px-2 text-right">
                                                        <button
                                                            onClick={() => setSelectedReport(report)}
                                                            className="p-2 text-gray-500 hover:text-cyan-400 hover:bg-cyan-400/10 rounded-lg transition-all"
                                                            title="Edit Grade"
                                                        >
                                                            <Edit3 className="w-5 h-5" />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* My Students Section */}
            <div className="space-y-4">
                <div className="flex items-center gap-2 px-1">
                    <Users className="w-5 h-5 text-cyan-400" />
                    <h2 className="text-xl font-bold text-white">Assigned Students ({students.length})</h2>
                </div>

                {students.length === 0 ? (
                    <div className="bg-[#0d1717] border border-[#1a3333] rounded-xl p-8 text-center">
                        <Users className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                        <p className="text-gray-400 mb-2">No students assigned yet.</p>
                        <p className="text-gray-500 text-sm">
                            Use the "Add Student by Email" input above to assign students to your class.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {students.map((student) => (
                            <div
                                key={student._id}
                                className="bg-[#0d1717] border border-[#1a3333] rounded-xl p-4 hover:border-cyan-400/50 transition-colors flex flex-col items-center text-center"
                            >
                                <div className="w-12 h-12 bg-cyan-400/20 rounded-full flex items-center justify-center mb-3">
                                    <Users className="w-6 h-6 text-cyan-400" />
                                </div>
                                <h3 className="text-white font-bold">{student.username}</h3>
                                <p className="text-gray-400 text-xs mb-2">{student.email}</p>
                                <div className="text-cyan-400 font-mono text-sm bg-cyan-400/10 px-3 py-1 rounded-full">
                                    Score: {student.totalScore || student.score || 0}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Grading Modal */}
            {selectedReport && (
                <GradingModal
                    report={selectedReport}
                    onClose={() => setSelectedReport(null)}
                    onSuccess={fetchDashboardData}
                />
            )}
        </div>
    );
};

export default InstructorDashboard;
