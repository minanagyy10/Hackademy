import { Link, useLocation } from 'react-router-dom';
import { Shield, FileText, Trophy, MessageSquare, Users, ChevronRight, Zap, Target, Award } from 'lucide-react';

const Features = () => {
    const location = useLocation();
    const isActive = (path) => location.pathname === path;

    const features = [
        {
            icon: FileText,
            title: 'Vulnerability Reporting',
            description: 'Submit detailed security reports with structured templates. Document your findings professionally and track their status.',
            color: 'from-cyan-500 to-cyan-400'
        },
        {
            icon: Trophy,
            title: 'Real-time Leaderboard',
            description: 'Compete with fellow hackers on a live-updated ranking system. Earn points for every successful submission.',
            color: 'from-yellow-500 to-orange-400'
        },
        {
            icon: MessageSquare,
            title: 'Instructor Feedback',
            description: 'Receive personalized feedback from expert instructors. Improve your skills with actionable insights.',
            color: 'from-purple-500 to-pink-400'
        },
        {
            icon: Target,
            title: 'Practice Challenges',
            description: 'Access a library of real-world scenarios across multiple difficulty levels. Sharpen your skills hands-on.',
            color: 'from-green-500 to-emerald-400'
        },
        {
            icon: Award,
            title: 'Skill Certification',
            description: 'Earn recognized certifications as you progress. Showcase your expertise to potential employers.',
            color: 'from-blue-500 to-indigo-400'
        },
        {
            icon: Users,
            title: 'Community Support',
            description: 'Join a thriving community of security enthusiasts. Collaborate, learn, and grow together.',
            color: 'from-red-500 to-rose-400'
        }
    ];

    return (
        <div className="min-h-screen bg-[#0a0f0f] relative overflow-hidden">
            {/* Decorative curved lines on left */}
            <div className="absolute left-0 top-1/4 w-64 h-96 opacity-30 pointer-events-none">
                <svg viewBox="0 0 200 400" className="w-full h-full">
                    <path d="M 0 50 Q 150 100 50 200 Q -50 300 100 400" stroke="url(#gradient1)" strokeWidth="1" fill="none" />
                    <path d="M 20 50 Q 170 120 70 220 Q -30 320 120 420" stroke="url(#gradient1)" strokeWidth="0.5" fill="none" />
                    <path d="M 40 50 Q 190 140 90 240 Q -10 340 140 440" stroke="url(#gradient1)" strokeWidth="0.5" fill="none" />
                    <defs>
                        <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#00bcd4" />
                            <stop offset="100%" stopColor="#0a0f0f" />
                        </linearGradient>
                    </defs>
                </svg>
            </div>

            {/* Navbar */}
            <nav className="relative z-10 flex items-center justify-between px-8 md:px-16 py-6">
                <Link to="/" className="text-2xl font-light italic text-white tracking-wide">
                    <span className="text-cyan-400">H</span>ackademy
                </Link>
                <div className="flex items-center gap-4">
                    <div className="hidden md:flex items-center gap-1">
                        <Link to="/" className={`px-5 py-2 text-sm font-medium rounded-full transition-colors ${isActive('/') ? 'bg-cyan-500 text-white' : 'text-gray-300 hover:text-white'}`}>
                            Home
                        </Link>
                        <Link to="/features" className={`px-5 py-2 text-sm font-medium rounded-full transition-colors ${isActive('/features') ? 'bg-cyan-500 text-white' : 'text-gray-300 hover:text-white'}`}>
                            Features
                        </Link>
                        <Link to="/contact" className={`px-5 py-2 text-sm font-medium transition-colors ${isActive('/contact') ? 'text-cyan-400' : 'text-cyan-400 hover:text-cyan-300'}`}>
                            ContactUs
                        </Link>
                    </div>
                    <Link to="/login" className="w-10 h-10 rounded-full border-2 border-gray-600 flex items-center justify-center text-gray-400 hover:border-cyan-400 hover:text-cyan-400 transition-colors">
                        <Shield className="w-5 h-5" />
                    </Link>
                </div>
            </nav>

            {/* Page Content */}
            <div className="relative z-10 px-8 md:px-16 py-12">
                {/* Header */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500/10 border border-cyan-500/20 rounded-full mb-6">
                        <Zap className="w-4 h-4 text-cyan-400" />
                        <span className="text-cyan-400 text-sm font-medium">Platform Capabilities</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        Powerful <span className="text-cyan-400">Features</span>
                    </h1>
                    <p className="text-gray-400 max-w-2xl mx-auto">
                        Everything you need to master cybersecurity, from hands-on practice to expert guidance.
                    </p>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                    {features.map((feature, index) => {
                        const Icon = feature.icon;
                        return (
                            <div
                                key={index}
                                className="group bg-[#0d1717] border border-[#1a3333] rounded-2xl p-6 hover:border-cyan-500/30 transition-all duration-300 hover:transform hover:-translate-y-1"
                            >
                                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                                    <Icon className="w-7 h-7 text-white" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                                <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
                            </div>
                        );
                    })}
                </div>

                {/* CTA Section */}
                <div className="text-center mt-16">
                    <Link
                        to="/login"
                        className="inline-flex items-center gap-2 px-8 py-3 bg-cyan-500 hover:bg-cyan-600 text-white font-medium rounded-full transition-colors"
                    >
                        Get Started Now
                        <ChevronRight className="w-5 h-5" />
                    </Link>
                    <p className="text-gray-500 text-sm mt-4">
                        Dont have an account? <Link to="/login" className="text-cyan-400 hover:text-cyan-300">Sign up</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Features;
