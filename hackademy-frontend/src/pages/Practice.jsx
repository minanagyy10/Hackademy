import { Shield, Eye, RefreshCw, ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';

const Practice = () => {
    const levels = [
        {
            level: 1,
            title: 'Amazon level 1',
            description: 'Learn the basics and get comfortable with security thinking',
            icon: ShoppingCart,
        },
        {
            level: 2,
            title: 'Amazon level 2',
            description: 'Analyze deeper challenges and work more independently',
            icon: ShoppingCart,
        },
        {
            level: 3,
            title: 'Amazon level 3',
            description: 'Tackle realistic scenarios and document professional results',
            icon: ShoppingCart,
        },
    ];

    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Title */}
            <div className="text-center mb-12">
                <h1 className="text-3xl font-bold text-white mb-4">
                    Learn To Hack || Hack To Learn
                </h1>
                <p className="text-gray-400 max-w-2xl mx-auto">
                    Choose a level and test your skills by finding and fixing vulnerabilities.
                    Submit your reports and get feedback from instructors to improve.
                </p>
            </div>



            {/* Level Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {levels.map((item) => {
                    const Icon = item.icon;
                    return (
                        <Link
                            key={item.level}
                            to="/student/submit-report"
                            className="bg-[#0d1717] border border-[#1a3333] rounded-xl p-6 hover:border-cyan-400/50 transition-all group text-center"
                        >
                            {/* Icon */}
                            <div className="w-14 h-14 bg-cyan-400/10 border border-cyan-400/30 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Icon className="w-6 h-6 text-cyan-400" />
                            </div>

                            {/* Level Badge */}
                            <div className="text-cyan-400 text-sm font-medium mb-2">
                                LV.{item.level}
                            </div>

                            {/* Title */}
                            <h3 className="text-white font-semibold mb-3 group-hover:text-cyan-400 transition-colors">
                                {item.title}
                            </h3>

                            {/* Description */}
                            <p className="text-gray-400 text-sm">
                                {item.description}
                            </p>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
};

export default Practice;
