import { Link, useLocation } from 'react-router-dom';
import { Shield, User, ChevronRight } from 'lucide-react';
import WavePattern from '../components/WavePattern';

const LandingPage = () => {
    const location = useLocation();
    const isActive = (path) => location.pathname === path;

    return (
        <div className="min-h-screen bg-[#0a0f0f] relative overflow-hidden">
            {/* Abstract Wave Lines - Top Left Corner */}
            <div className="absolute top-0 left-0 w-[500px] h-[450px] -translate-x-20 -translate-y-16 rotate-12 opacity-35 pointer-events-none z-0">
                <WavePattern />
            </div>

            {/* Navbar */}
            <nav className="relative z-10 flex items-center justify-between px-8 md:px-16 py-6">
                {/* Logo */}
                <Link to="/" className="text-2xl font-light italic text-white tracking-wide">
                    <span className="text-cyan-400">H</span>ackademy
                </Link>

                {/* Navigation Links */}
                <div className="flex items-center gap-4">
                    <div className="hidden md:flex items-center gap-1">
                        <Link
                            to="/"
                            className={`px-5 py-2 text-sm font-medium rounded-full transition-colors ${isActive('/') ? 'bg-cyan-500 text-white' : 'text-gray-300 hover:text-white'
                                }`}
                        >
                            Home
                        </Link>
                        <Link
                            to="/features"
                            className={`px-5 py-2 text-sm font-medium rounded-full transition-colors ${isActive('/features') ? 'bg-cyan-500 text-white' : 'text-gray-300 hover:text-white'
                                }`}
                        >
                            Features
                        </Link>
                        <Link
                            to="/contact"
                            className={`px-5 py-2 text-sm font-medium transition-colors ${isActive('/contact') ? 'text-cyan-400' : 'text-cyan-400 hover:text-cyan-300'
                                }`}
                        >
                            ContactUs
                        </Link>
                    </div>

                    {/* Profile Icon */}
                    <Link
                        to="/login"
                        className="w-10 h-10 rounded-full border-2 border-gray-600 flex items-center justify-center text-gray-400 hover:border-cyan-400 hover:text-cyan-400 transition-colors"
                    >
                        <User className="w-5 h-5" />
                    </Link>
                </div>
            </nav>

            {/* Hero Section */}
            <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between px-8 md:px-16 py-12 min-h-[calc(100vh-100px)]">
                {/* Left Content */}
                <div className="max-w-xl lg:max-w-lg xl:max-w-xl">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
                        Empowering You<br />
                        in the <span className="text-cyan-400">Digital Age</span>
                    </h1>

                    <p className="text-gray-400 text-sm md:text-base leading-relaxed mb-10 italic max-w-md">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                        Vestibulum congue metus quis accumsan euismod.
                        Maecenas sed est mollis, convallis nisi convallis, imperdiet
                        massa. Proin ipsum nunc, lacinia ac faucibus quis,
                        ullamcorper non metus.
                    </p>

                    {/* Login Button */}
                    <div className="flex flex-col items-start gap-4">
                        <Link
                            to="/login"
                            className="px-10 py-3 bg-cyan-500 hover:bg-cyan-600 text-white font-medium rounded-full transition-colors text-center"
                        >
                            log in
                        </Link>

                        <p className="text-gray-400 text-sm">
                            Dont have an account ?{' '}
                            <Link to="/login" className="text-cyan-400 hover:text-cyan-300 font-medium">
                                Sign up
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Right Content - Shield Illustration (Prominent, ~45% viewport width) */}
                <div className="relative mt-8 lg:mt-0 flex-shrink-0 w-full lg:w-[45vw] max-w-[600px] lg:max-w-none">
                    {/* Main Image Container */}
                    <div className="relative w-full h-[300px] sm:h-[400px] md:h-[450px] lg:h-[70vh] max-h-[600px]">
                        {/* Subtle glow effect behind image */}
                        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-cyan-400/5 blur-3xl scale-110"></div>
                        {/* The Glow Halo */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%] h-[70%] bg-cyan-500/40 rounded-full blur-[100px] pointer-events-none"></div>
                        {/* The Shield Logo - Large and Prominent */}
                        <img
                            src="/logo.png"
                            alt="Security Shield"
                            className="relative z-10 w-full h-full object-contain object-center drop-shadow-2xl"
                        />

                        {/* Decorative arc on the right edge */}
                        <svg className="absolute -right-2 top-1/2 -translate-y-1/2 w-16 h-32 lg:w-24 lg:h-48 opacity-50" viewBox="0 0 50 100">
                            <path
                                d="M 0 0 Q 50 50 0 100"
                                stroke="#1a4a4a"
                                strokeWidth="2"
                                fill="none"
                            />
                        </svg>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LandingPage;
