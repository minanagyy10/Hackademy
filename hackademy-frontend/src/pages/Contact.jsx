import { Link, useLocation } from 'react-router-dom';
import { Shield, Mail, User, MessageSquare, Send, MapPin, Phone, Clock } from 'lucide-react';
import { useState } from 'react';

const Contact = () => {
    const location = useLocation();
    const isActive = (path) => location.pathname === path;
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        // Simulate form submission
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 3000);
        setFormData({ name: '', email: '', message: '' });
    };

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
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        Get in <span className="text-cyan-400">Touch</span>
                    </h1>
                    <p className="text-gray-400 max-w-xl mx-auto">
                        Have questions about our platform? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
                    </p>
                </div>

                <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Contact Form */}
                    <div className="bg-[#0d1717] border border-[#1a3333] rounded-2xl p-8">
                        <h2 className="text-2xl font-bold text-white mb-6">Send us a message</h2>

                        {submitted && (
                            <div className="mb-6 p-4 bg-green-500/10 border border-green-500/30 rounded-lg text-green-400 text-sm">
                                ✓ Message sent successfully! We'll get back to you soon.
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="block text-gray-400 text-sm mb-2">Your Name</label>
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        placeholder="John Doe"
                                        required
                                        className="w-full bg-[#0a0f0f] border border-[#1a3333] rounded-xl pl-12 pr-4 py-3 text-white placeholder-gray-600 focus:border-cyan-500 focus:outline-none transition-colors"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-gray-400 text-sm mb-2">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        placeholder="you@example.com"
                                        required
                                        className="w-full bg-[#0a0f0f] border border-[#1a3333] rounded-xl pl-12 pr-4 py-3 text-white placeholder-gray-600 focus:border-cyan-500 focus:outline-none transition-colors"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-gray-400 text-sm mb-2">Your Message</label>
                                <div className="relative">
                                    <MessageSquare className="absolute left-4 top-4 w-5 h-5 text-gray-500" />
                                    <textarea
                                        value={formData.message}
                                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                        placeholder="Tell us what you need..."
                                        required
                                        rows={5}
                                        className="w-full bg-[#0a0f0f] border border-[#1a3333] rounded-xl pl-12 pr-4 py-3 text-white placeholder-gray-600 focus:border-cyan-500 focus:outline-none transition-colors resize-none"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-cyan-500 hover:bg-cyan-600 text-white font-medium rounded-full transition-colors"
                            >
                                <Send className="w-5 h-5" />
                                Send Message
                            </button>
                        </form>
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-6">
                        <div className="bg-[#0d1717] border border-[#1a3333] rounded-2xl p-6 flex items-start gap-4">
                            <div className="w-12 h-12 bg-cyan-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
                                <MapPin className="w-6 h-6 text-cyan-400" />
                            </div>
                            <div>
                                <h3 className="text-white font-semibold mb-1">Our Location</h3>
                                <p className="text-gray-400 text-sm">123 Cyber Street, Tech District<br />Silicon Valley, CA 94000</p>
                            </div>
                        </div>

                        <div className="bg-[#0d1717] border border-[#1a3333] rounded-2xl p-6 flex items-start gap-4">
                            <div className="w-12 h-12 bg-cyan-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
                                <Mail className="w-6 h-6 text-cyan-400" />
                            </div>
                            <div>
                                <h3 className="text-white font-semibold mb-1">Email Us</h3>
                                <p className="text-gray-400 text-sm">support@hackademy.io<br />info@hackademy.io</p>
                            </div>
                        </div>

                        <div className="bg-[#0d1717] border border-[#1a3333] rounded-2xl p-6 flex items-start gap-4">
                            <div className="w-12 h-12 bg-cyan-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
                                <Phone className="w-6 h-6 text-cyan-400" />
                            </div>
                            <div>
                                <h3 className="text-white font-semibold mb-1">Call Us</h3>
                                <p className="text-gray-400 text-sm">+1 (555) 123-4567<br />+1 (555) 987-6543</p>
                            </div>
                        </div>

                        <div className="bg-[#0d1717] border border-[#1a3333] rounded-2xl p-6 flex items-start gap-4">
                            <div className="w-12 h-12 bg-cyan-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
                                <Clock className="w-6 h-6 text-cyan-400" />
                            </div>
                            <div>
                                <h3 className="text-white font-semibold mb-1">Working Hours</h3>
                                <p className="text-gray-400 text-sm">Monday - Friday: 9AM - 6PM<br />Weekend: 10AM - 4PM</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
