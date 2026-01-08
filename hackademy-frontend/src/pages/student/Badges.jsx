import { useState, useEffect } from 'react';
import { mainApi } from '../../api/axiosConfig';
import {
    Trophy,
    Lock,
    Loader2,
    AlertCircle,
    Award,
    Star,
    Sparkles,
    Crown
} from 'lucide-react';

const Badges = () => {
    const [badges, setBadges] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [stats, setStats] = useState(null);
    const [earnedCount, setEarnedCount] = useState(0);
    const [checkingBadges, setCheckingBadges] = useState(false);
    const [newBadges, setNewBadges] = useState([]);

    useEffect(() => {
        fetchBadges();
    }, []);

    const fetchBadges = async () => {
        try {
            setLoading(true);
            const response = await mainApi.get('/api/badges/student');
            setBadges(response.data.badges || []);
            setStats(response.data.stats);
            setEarnedCount(response.data.earnedCount || 0);
        } catch (err) {
            console.error('Error fetching badges:', err);
            setError('Failed to load badges');
        } finally {
            setLoading(false);
        }
    };

    const handleCheckBadges = async () => {
        try {
            setCheckingBadges(true);
            const response = await mainApi.post('/api/badges/check');
            if (response.data.newBadges && response.data.newBadges.length > 0) {
                setNewBadges(response.data.newBadges);
                // Refresh badges list
                fetchBadges();
            }
        } catch (err) {
            console.error('Error checking badges:', err);
        } finally {
            setCheckingBadges(false);
        }
    };

    // Get category color
    const getCategoryColor = (category) => {
        switch (category) {
            case 'Bronze': return 'from-amber-700 to-amber-900';
            case 'Silver': return 'from-gray-300 to-gray-500';
            case 'Gold': return 'from-yellow-400 to-yellow-600';
            case 'Platinum': return 'from-cyan-300 to-cyan-500';
            case 'Special': return 'from-purple-400 to-pink-500';
            default: return 'from-gray-600 to-gray-800';
        }
    };

    // Get rarity glow
    const getRarityGlow = (rarity, earned) => {
        if (!earned) return '';
        switch (rarity) {
            case 'common': return 'shadow-lg shadow-gray-500/30';
            case 'uncommon': return 'shadow-lg shadow-green-500/40';
            case 'rare': return 'shadow-lg shadow-blue-500/50';
            case 'epic': return 'shadow-lg shadow-purple-500/60';
            case 'legendary': return 'shadow-xl shadow-yellow-400/70 animate-pulse';
            default: return '';
        }
    };

    // Get rarity label color
    const getRarityColor = (rarity) => {
        switch (rarity) {
            case 'common': return 'text-gray-400';
            case 'uncommon': return 'text-green-400';
            case 'rare': return 'text-blue-400';
            case 'epic': return 'text-purple-400';
            case 'legendary': return 'text-yellow-400';
            default: return 'text-gray-400';
        }
    };

    // Get tier icon
    const getTierIcon = (category) => {
        switch (category) {
            case 'Bronze': return <Award className="w-4 h-4" />;
            case 'Silver': return <Star className="w-4 h-4" />;
            case 'Gold': return <Trophy className="w-4 h-4" />;
            case 'Platinum': return <Sparkles className="w-4 h-4" />;
            case 'Special': return <Crown className="w-4 h-4" />;
            default: return <Award className="w-4 h-4" />;
        }
    };

    if (loading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 text-cyan-400 animate-spin mx-auto mb-4" />
                    <p className="text-gray-400">Loading your achievements...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 mb-2">
                    🏆 Achievement Badges
                </h1>
                <p className="text-gray-400">
                    Earn badges by completing challenges and reaching milestones
                </p>
            </div>

            {/* Stats Bar */}
            <div className="bg-[#0d1717] border border-[#1a3333] rounded-xl p-6 mb-8">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-6">
                        <div className="text-center">
                            <p className="text-3xl font-bold text-cyan-400">{earnedCount}</p>
                            <p className="text-xs text-gray-500 uppercase">Earned</p>
                        </div>
                        <div className="h-10 w-px bg-[#1a3333]"></div>
                        <div className="text-center">
                            <p className="text-3xl font-bold text-gray-400">{badges.length - earnedCount}</p>
                            <p className="text-xs text-gray-500 uppercase">Locked</p>
                        </div>
                        <div className="h-10 w-px bg-[#1a3333]"></div>
                        <div className="text-center">
                            <p className="text-3xl font-bold text-purple-400">
                                {badges.length > 0 ? Math.round((earnedCount / badges.length) * 100) : 0}%
                            </p>
                            <p className="text-xs text-gray-500 uppercase">Complete</p>
                        </div>
                    </div>
                    <button
                        onClick={handleCheckBadges}
                        disabled={checkingBadges}
                        className="px-4 py-2 bg-cyan-400/10 hover:bg-cyan-400/20 text-cyan-400 rounded-lg font-medium transition-colors flex items-center gap-2 disabled:opacity-50"
                    >
                        {checkingBadges ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <Trophy className="w-4 h-4" />
                        )}
                        Check for New Badges
                    </button>
                </div>

                {/* Progress Bar */}
                <div className="mt-4">
                    <div className="h-2 bg-[#1a3333] rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-cyan-400 to-purple-500 transition-all duration-500"
                            style={{ width: `${badges.length > 0 ? (earnedCount / badges.length) * 100 : 0}%` }}
                        ></div>
                    </div>
                </div>
            </div>

            {/* New Badges Alert */}
            {newBadges.length > 0 && (
                <div className="mb-8 p-4 bg-gradient-to-r from-cyan-400/20 to-purple-500/20 border border-cyan-400/50 rounded-xl animate-pulse">
                    <div className="flex items-center gap-3">
                        <Sparkles className="w-6 h-6 text-yellow-400" />
                        <div>
                            <p className="text-white font-semibold">🎉 Congratulations! You earned new badges:</p>
                            <div className="flex flex-wrap gap-2 mt-2">
                                {newBadges.map((badge, idx) => (
                                    <span key={idx} className="px-2 py-1 bg-cyan-400/20 text-cyan-400 rounded text-sm">
                                        {badge.icon} {badge.name}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Error State */}
            {error && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg flex items-center gap-3 text-red-400">
                    <AlertCircle className="w-5 h-5" />
                    <span>{error}</span>
                </div>
            )}

            {/* Badges Grid by Category */}
            {['Bronze', 'Silver', 'Gold', 'Platinum', 'Special'].map(category => {
                const categoryBadges = badges.filter(b => b.category === category);
                if (categoryBadges.length === 0) return null;

                return (
                    <div key={category} className="mb-8">
                        {/* Category Header */}
                        <div className="flex items-center gap-3 mb-4">
                            <div className={`px-3 py-1 rounded-full bg-gradient-to-r ${getCategoryColor(category)} text-white text-sm font-semibold flex items-center gap-2`}>
                                {getTierIcon(category)}
                                {category} Tier
                            </div>
                            <div className="flex-1 h-px bg-[#1a3333]"></div>
                            <span className="text-gray-500 text-sm">
                                {categoryBadges.filter(b => b.earned).length}/{categoryBadges.length}
                            </span>
                        </div>

                        {/* Badges Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                            {categoryBadges.map(badge => (
                                <div
                                    key={badge._id}
                                    className={`relative group rounded-xl border transition-all duration-300 ${badge.earned
                                            ? `bg-[#0d1717] border-[#1a3333] hover:border-cyan-400/50 ${getRarityGlow(badge.rarity, badge.earned)}`
                                            : 'bg-[#0a0f0f] border-[#1a3333]/50 opacity-60 grayscale hover:opacity-80 hover:grayscale-0'
                                        }`}
                                >
                                    {/* Lock Overlay for locked badges */}
                                    {!badge.earned && (
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-xl z-10">
                                            <Lock className="w-8 h-8 text-gray-500" />
                                        </div>
                                    )}

                                    {/* Badge Content */}
                                    <div className="p-4 text-center">
                                        {/* Icon */}
                                        <div className={`text-4xl mb-2 ${badge.earned ? '' : 'opacity-50'}`}>
                                            {badge.icon}
                                        </div>

                                        {/* Name */}
                                        <h3 className={`font-semibold text-sm mb-1 ${badge.earned ? 'text-white' : 'text-gray-500'}`}>
                                            {badge.name}
                                        </h3>

                                        {/* Rarity */}
                                        <p className={`text-xs capitalize ${getRarityColor(badge.rarity)}`}>
                                            {badge.rarity}
                                        </p>

                                        {/* Earned Date */}
                                        {badge.earned && badge.earnedAt && (
                                            <p className="text-[10px] text-gray-500 mt-2">
                                                Earned {new Date(badge.earnedAt).toLocaleDateString()}
                                            </p>
                                        )}
                                    </div>

                                    {/* Tooltip */}
                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-[#0a0f0f] border border-[#1a3333] rounded-lg text-xs opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20 w-48 text-center">
                                        <p className="text-white font-semibold mb-1">{badge.name}</p>
                                        <p className="text-gray-400">{badge.description}</p>
                                        {!badge.earned && (
                                            <p className="text-cyan-400 mt-1 text-[10px]">
                                                🔒 Keep working to unlock!
                                            </p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            })}

            {/* Empty State */}
            {badges.length === 0 && !loading && (
                <div className="text-center py-16">
                    <Trophy className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-400">No Badges Available</h3>
                    <p className="text-gray-500">Check back later for achievements to unlock!</p>
                </div>
            )}
        </div>
    );
};

export default Badges;
