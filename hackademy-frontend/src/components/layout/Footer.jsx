import { Instagram, Facebook, Twitter, Youtube, Mail, MapPin, Phone } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-[#0a0f0f] border-t border-[#1a3333] mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Left Side - Logo & Description */}
                    <div>
                        <h2 className="text-xl font-bold mb-2">
                            <span className="text-cyan-400">H</span>
                            <span className="text-white">ackademy</span>
                        </h2>
                        <p className="text-gray-500 text-sm mb-4 max-w-md">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                            Morbi at amet neque tortor
                        </p>

                        {/* Social Icons */}
                        <div className="flex gap-3">
                            {[Instagram, Facebook, Twitter, Youtube].map((Icon, index) => (
                                <a
                                    key={index}
                                    href="#"
                                    className="w-9 h-9 border border-[#1a3333] rounded-md flex items-center justify-center text-gray-400 hover:text-cyan-400 hover:border-cyan-400 transition-colors"
                                >
                                    <Icon className="w-4 h-4" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Right Side - Contact Info */}
                    <div className="md:text-right">
                        <h3 className="text-white font-semibold mb-4">Contact Us</h3>
                        <div className="space-y-2">
                            <a
                                href="mailto:Hackademy@website.com"
                                className="flex items-center gap-2 text-gray-400 text-sm md:justify-end hover:text-cyan-400 transition-colors"
                            >
                                <Mail className="w-4 h-4" />
                                Hackademy@website.com
                            </a>
                            <div className="flex items-center gap-2 text-gray-400 text-sm md:justify-end">
                                <MapPin className="w-4 h-4" />
                                838 Carol St.drt, ENG
                            </div>
                            <div className="flex items-center gap-2 text-gray-400 text-sm md:justify-end">
                                <Phone className="w-4 h-4" />
                                +20 0123000000
                            </div>
                        </div>
                    </div>
                </div>

                {/* Copyright */}
                <div className="border-t border-[#1a3333] mt-8 pt-6 text-center">
                    <p className="text-gray-500 text-sm">
                        © {new Date().getFullYear()} Hackademy. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
