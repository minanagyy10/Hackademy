import { useState, useEffect } from 'react';
import { mainApi } from '../api/axiosConfig';
import { useAuth } from '../context/AuthContext';
import {
    Trophy,
    User,
    Loader2,
    Star,
    Medal,
    Crown,
    Target,
    TrendingUp
} from 'lucide-react';

const Leaderboard = () => {
    const { user } = useAuth();
    const [topStudents, setTopStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchLeaderboard();
    }, []);

    const fetchLeaderboard = async () => {
        setLoading(true);
        setError('');
        try {
            // Fetch top users sorted by points
            const response = await mainApi.get('/api/scores/leaderboard?limit=15');
            setTopStudents(response.data.topStudents || []);
        } catch (err) {
            console.error('Error fetching leaderboard:', err);
            setError('Failed to sync data with the hive.');
        } finally {
            setLoading(false);
        }
    };

    // Skeleton Loader Component
    const SkeletonRow = () => (
        <div className="bg-[#0a0f0f] border border-[#1a3333] rounded-xl p-4 flex items-center justify-between animate-pulse">
            <div className="flex items-center gap-4">
                <div className="w-6 h-6 bg-gray-800 rounded"></div>
                <div className="w-10 h-10 bg-gray-800 rounded-full"></div>
                <div className="w-32 h-4 bg-gray-800 rounded"></div>
            </div>
            <div className="w-16 h-4 bg-gray-800 rounded"></div>
        </div>
    );

    if (loading && topStudents.length === 0) {
        return (
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="text-center mb-12">
                    <div className="h-10 w-64 bg-gray-800 rounded mx-auto mb-4 animate-pulse"></div>
                    <div className="h-4 w-48 bg-gray-800 rounded mx-auto animate-pulse"></div>
                </div>
                <div className="space-y-4">
                    {[...Array(8)].map((_, i) => <SkeletonRow key={i} />)}
                </div>
            </div>
        );
    }

    const podium = topStudents.slice(0, 3);
    const rest = topStudents.slice(3);

    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-700">
            {/* Header Section */}
            <div className="text-center mb-12 relative">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-cyan-400/5 blur-[100px] -z-10 rounded-full"></div>
                <h1 className="text-4xl font-black text-white mb-3 tracking-tight uppercase flex items-center justify-center gap-3">
                    <Crown className="w-8 h-8 text-yellow-400" />
                    Wall of Fame
                </h1>
                <p className="text-gray-500 font-mono text-sm max-w-md mx-auto">
                    Global ranking of the most skilled hackers in the academy. Complete reports to climb the ranks.
                </p>
            </div>

            {/* Top 3 Podium Cards */}
            {podium.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    {podium.map((student, index) => {
                        const rank = index + 1;
                        const isFirst = rank === 1;
                        const isSecond = rank === 2;
                        const isThird = rank === 3;
                        const isSelf = user?.email === student.email || user?.username === student.username;

                        return (
                            <div
                                key={student._id || index}
                                className={`relative group p-[2px] rounded-2xl overflow-hidden transition-all duration-500 hover:scale-[1.02] ${isFirst ? 'md:-translate-y-4 z-10' : 'md:translate-y-2'
                                    }`}
                            >
                                {/* Animated Borders for Top 3 */}
                                <div className={`absolute inset-0 opacity-20 group-hover:opacity-100 transition-opacity duration-500 ${isFirst ? 'bg-gradient-to-r from-yellow-600 via-yellow-400 to-yellow-600' :
                                        isSecond ? 'bg-gradient-to-r from-gray-400 via-gray-200 to-gray-400' :
                                            'bg-gradient-to-r from-amber-700 via-amber-500 to-amber-700'
                                    } animate-spin-slow`}></div>

                                <div className={`relative h-full bg-[#0d1717] rounded-2xl p-6 text-center border border-[#1a3333] ${isSelf ? 'border-cyan-400/50 bg-cyan-400/[0.02]' : ''
                                    }`}>
                                    {/* Rank Icon */}
                                    <div className="flex justify-center mb-4">
                                        <div className={`w-16 h-16 rounded-full flex items-center justify-center relative ${isFirst ? 'bg-yellow-400/10 text-yellow-400' :
                                                isSecond ? 'bg-gray-400/10 text-gray-400' :
                                                    'bg-amber-600/10 text-amber-600'
                                            }`}>
                                            {isFirst ? <Crown className="w-8 h-8" /> : rank === 2 ? <Medal className="w-8 h-8" /> : <Medal className="w-8 h-8" />}
                                            <span className="absolute -top-1 -right-1 bg-[#0a0f0f] border border-current rounded-full w-6 h-6 text-xs flex items-center justify-center font-black">
                                                {rank}
                                            </span>
                                        </div>
                                    </div>

                                    {/* User Info */}
                                    <h3 className="text-white font-bold text-xl mb-1 truncate px-2 capitalize">
                                        {student.username}
                                    </h3>
                                    <div className="flex items-center justify-center gap-2 text-cyan-400 font-mono mb-4">
                                        <TrendingUp className="w-4 h-4" />
                                        <span className="text-2xl font-black">{student.totalScore}</span>
                                        <span className="text-[10px] uppercase text-gray-500 font-bold tracking-widest mt-1">pts</span>
                                    </div>

                                    {/* Self Tag */}
                                    {isSelf && (
                                        <div className="inline-block px-3 py-1 bg-cyan-400/10 border border-cyan-400/20 rounded-full text-[10px] text-cyan-400 font-bold uppercase tracking-tighter">
                                            You
                                        </div>
                                    )}

                                    {/* Visual Polish */}
                                    <div className={`absolute bottom-0 left-0 right-0 h-1 rounded-full blur-[2px] ${isFirst ? 'bg-yellow-400' : isSecond ? 'bg-gray-400' : 'bg-amber-600'
                                        } opacity-10`}></div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* List for Rank 4+ */}
            <div className="space-y-3">
                {rest.length > 0 && (
                    <div className="px-6 py-2 flex items-center text-[10px] font-black uppercase text-gray-600 tracking-[0.2em]">
                        <span className="w-12">Rank</span>
                        <span className="flex-grow">Username</span>
                        <span>Score</span>
                    </div>
                )}

                {rest.map((student, index) => {
                    const rank = index + 4;
                    const isSelf = user?.email === student.email || user?.username === student.username;

                    return (
                        <div
                            key={student._id || index}
                            className={`bg-[#0d1717] border border-[#1a3333] rounded-xl p-4 flex items-center justify-between transition-all hover:bg-white/[0.02] group ${isSelf ? 'border-cyan-400/30 bg-cyan-400/[0.02]' : ''
                                }`}
                        >
                            <div className="flex items-center gap-6">
                                <span className={`font-mono font-bold w-6 text-center ${isSelf ? 'text-cyan-400' : 'text-gray-500'}`}>
                                    {rank}
                                </span>
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${isSelf ? 'bg-cyan-400/20 text-cyan-400' : 'bg-[#0a0f0f] text-gray-600 group-hover:bg-[#1a3333] group-hover:text-gray-400'
                                    }`}>
                                    <User className="w-5 h-5" />
                                </div>
                                <div className="flex flex-col">
                                    <span className={`font-bold transition-colors capitalize ${isSelf ? 'text-cyan-400' : 'text-white'}`}>
                                        {student.username}
                                    </span>
                                    {isSelf && <span className="text-[10px] text-cyan-500/50 uppercase font-black font-mono">Current Operator</span>}
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                {isSelf && (
                                    <Target className="w-4 h-4 text-cyan-400 animate-pulse" />
                                )}
                                <div className={`flex flex-col items-end ${isSelf ? 'text-cyan-400' : 'text-white'}`}>
                                    <span className="font-black font-mono text-lg">{student.totalScore}</span>
                                    <span className="text-[10px] text-gray-600 font-bold uppercase -mt-1 tracking-tighter">Points</span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Error Message */}
            {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/50 rounded-lg flex items-center justify-center gap-3 text-red-400 text-sm mt-8">
                    <AlertCircle className="w-5 h-5" />
                    <span>{error}</span>
                    <button onClick={fetchLeaderboard} className="underline hover:no-underline font-bold">Retry</button>
                </div>
            )}

            {/* Empty State */}
            {!loading && topStudents.length === 0 && (
                <div className="text-center py-24 bg-[#0d1717] border-2 border-dashed border-[#1a3333] rounded-3xl">
                    <Trophy className="w-20 h-20 text-gray-700 mx-auto mb-6 opacity-30" />
                    <h3 className="text-2xl font-black text-gray-400 uppercase tracking-tighter mb-2">No ranked hackers yet</h3>
                    <p className="text-gray-600 max-w-xs mx-auto">
                        Be the first to compromise the targets and claim your spot on the throne.
                    </p>
                    <div className="mt-8">
                        <div className="inline-block p-[1px] rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500">
                            <div className="px-6 py-2 bg-[#0d1717] rounded-lg text-cyan-400 text-xs font-black uppercase tracking-widest">
                                Status: Waiting for breach
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Global Stats Polish */}
            {!loading && topStudents.length > 0 && (
                <div className="mt-12 text-center">
                    <p className="text-[10px] text-gray-600 font-black uppercase tracking-[0.3em]">
                        Live Updates • Synchronized with Mainframe
                    </p>
                </div>
            )}
        </div>
    );
};

export default Leaderboard;
