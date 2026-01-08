import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { mainApi } from '../../api/axiosConfig';
import { useAuth } from '../../context/AuthContext';
import {
    Search,
    FileText,
    User,
    Star,
    Clock,
    Loader2,
    AlertCircle,
    Send,
    Trophy,
    Award,
    Award as BadgeIcon
} from 'lucide-react';
import ReportDetailsModal from '../../components/modals/ReportDetailsModal';

const StudentDashboard = () => {
    const { user } = useAuth();
    const [reports, setReports] = useState([]);
    const [totalScore, setTotalScore] = useState(0);
    const [instructor, setInstructor] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedReport, setSelectedReport] = useState(null);
    const [earnedBadges, setEarnedBadges] = useState([]);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        setLoading(true);
        setError('');

        try {
            // Fetch all data in parallel
            const [reportsRes, scoreRes, instructorRes, badgesRes] = await Promise.allSettled([
                mainApi.get('/api/students/reports'),
                mainApi.get('/api/students/totalScore'),
                mainApi.get('/api/students/instructor'),
                mainApi.get('/api/badges/student'),
            ]);

            if (reportsRes.status === 'fulfilled') {
                setReports(reportsRes.value.data.reports || []);
            }

            if (scoreRes.status === 'fulfilled') {
                setTotalScore(scoreRes.value.data.totalScore || 0);
            }

            if (instructorRes.status === 'fulfilled') {
                setInstructor(instructorRes.value.data.instructor);
            }

            if (badgesRes.status === 'fulfilled') {
                const badgeData = badgesRes.value.data.badges || [];
                setEarnedBadges(badgeData.filter(b => b.earned).slice(0, 3));
            }

        } catch (err) {
            console.error('Error fetching dashboard data:', err);
            setError('Failed to load dashboard data. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Filter reports by search term
    const filteredReports = reports.filter(report =>
        report.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.level?.toString().includes(searchTerm)
    );

    // Calculate time since submission
    const getTimeAgo = (date) => {
        const now = new Date();
        const submitted = new Date(date);
        const diffMs = now - submitted;
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        const diffWeeks = Math.floor(diffDays / 7);

        if (diffWeeks > 0) return `${diffWeeks} Week${diffWeeks > 1 ? 's' : ''}`;
        if (diffDays > 0) return `${diffDays} Day${diffDays > 1 ? 's' : ''}`;
        return 'Today';
    };

    if (loading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 text-cyan-400 animate-spin mx-auto mb-4" />
                    <p className="text-gray-400">Loading your dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Page Title */}
            <h1 className="text-3xl font-bold text-cyan-400 text-center mb-8">
                My Reports
            </h1>

            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-[#0d1717] border border-[#1a3333] rounded-xl p-4 flex items-center gap-4">
                    <div className="w-12 h-12 bg-cyan-400/20 rounded-full flex items-center justify-center">
                        <FileText className="w-6 h-6 text-cyan-400" />
                    </div>
                    <div>
                        <p className="text-gray-400 text-sm">Total Reports</p>
                        <p className="text-2xl font-bold text-white">{reports.length}</p>
                    </div>
                </div>

                <div className="bg-[#0d1717] border border-[#1a3333] rounded-xl p-4 flex items-center gap-4">
                    <div className="w-12 h-12 bg-cyan-400/20 rounded-full flex items-center justify-center">
                        <Trophy className="w-6 h-6 text-cyan-400" />
                    </div>
                    <div>
                        <p className="text-gray-400 text-sm">Total Score</p>
                        <p className="text-2xl font-bold text-white">{totalScore}</p>
                    </div>
                </div>

                <div className="bg-[#0d1717] border border-[#1a3333] rounded-xl p-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-cyan-400/20 rounded-full flex items-center justify-center">
                            <BadgeIcon className="w-6 h-6 text-cyan-400" />
                        </div>
                        <div>
                            <p className="text-gray-400 text-sm">Top Badges</p>
                            <div className="flex gap-1 mt-1">
                                {earnedBadges.length > 0 ? (
                                    earnedBadges.map((eb, idx) => (
                                        <span key={eb._id || idx} title={eb.name} className="text-lg">
                                            {eb.icon}
                                        </span>
                                    ))
                                ) : (
                                    <span className="text-xs text-gray-500 italic">No badges yet</span>
                                )}
                            </div>
                        </div>
                    </div>
                    <Link to="/student/badges" className="text-[10px] text-cyan-400 hover:underline uppercase font-bold">
                        View All
                    </Link>
                </div>
            </div>

            {/* Search Bar */}
            <div className="relative max-w-xl mx-auto mb-8">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                    type="text"
                    placeholder="Search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-[#0d1717] border border-[#1a3333] rounded-lg text-white placeholder-gray-500 focus:border-cyan-400 focus:outline-none transition-colors"
                />
            </div>

            {/* Error State */}
            {error && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg flex items-center gap-3 text-red-400">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <span>{error}</span>
                    <button
                        onClick={fetchDashboardData}
                        className="ml-auto text-sm underline hover:no-underline"
                    >
                        Retry
                    </button>
                </div>
            )}

            {/* Empty State */}
            {!loading && filteredReports.length === 0 && (
                <div className="text-center py-16">
                    <FileText className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-400 mb-2">
                        {searchTerm ? 'No reports match your search' : 'No reports submitted yet'}
                    </h3>
                    <p className="text-gray-500 mb-6">
                        {searchTerm
                            ? 'Try adjusting your search terms'
                            : 'Start by submitting your first report'}
                    </p>
                    {!searchTerm && (
                        <Link
                            to="/student/submit-report"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-cyan-400 text-[#0a0f0f] font-semibold rounded-lg hover:bg-cyan-500 transition-colors"
                        >
                            <Send className="w-5 h-5" />
                            Submit Report
                        </Link>
                    )}
                </div>
            )}

            {/* Reports Grid */}
            {filteredReports.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredReports.map((report) => (
                        <div
                            key={report._id}
                            onClick={() => setSelectedReport(report)}
                            className="gradient-card border border-[#1a3333] rounded-xl p-5 hover:border-cyan-400/50 transition-all cursor-pointer group flex flex-col h-full"
                        >
                            {/* Report Title */}
                            <h3 className="text-white font-semibold text-lg mb-3 group-hover:text-cyan-400 transition-colors capitalize">
                                {report.title || 'Untitled Report'}
                            </h3>

                            {/* Report Details */}
                            <div className="space-y-2 text-sm flex-grow">
                                <div className="flex items-center gap-2 text-gray-400">
                                    <User className="w-4 h-4" />
                                    <span>To: {report.instructor?.username || 'Unknown'}</span>
                                </div>

                                <div className="flex items-center gap-2 text-gray-400">
                                    <FileText className="w-4 h-4" />
                                    <span>Task level: LV.{report.level}</span>
                                </div>

                                <div className="flex items-center gap-2 text-gray-400">
                                    <Star className="w-4 h-4" />
                                    <span>
                                        Rating: {report.score?.score !== undefined ? `${report.score.score}/100` : report.score !== undefined && typeof report.score === 'number' ? `${report.score}/100` : 'Pending'}
                                    </span>
                                </div>
                            </div>

                            {/* Feedback Badge and View Button */}
                            <div className="mt-4 pt-3 border-t border-[#1a3333] flex items-center justify-between">
                                {report.feedback ? (
                                    <div className="px-2 py-1 bg-cyan-400/10 border border-cyan-400/20 rounded text-[10px] text-cyan-400 font-bold uppercase tracking-tight">
                                        Feedback Available
                                    </div>
                                ) : (
                                    <div className="text-gray-500 text-[10px] uppercase font-bold tracking-tight">
                                        Pending Review
                                    </div>
                                )}
                                <span className="text-cyan-400 text-xs font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                                    View Details →
                                </span>
                            </div>

                            {/* Time Ago */}
                            <div className="flex items-center gap-1 text-gray-500 text-[10px] mt-2">
                                <Clock className="w-3 h-3" />
                                <span>{getTimeAgo(report.submittedAt || report.createdAt)}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal */}
            {selectedReport && (
                <ReportDetailsModal
                    report={selectedReport}
                    onClose={() => setSelectedReport(null)}
                />
            )}
        </div>
    );
};

export default StudentDashboard;
