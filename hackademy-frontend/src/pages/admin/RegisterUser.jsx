import { useState } from 'react';
import { adminApi } from '../../api/axiosConfig';
import {
    UserPlus,
    GraduationCap,
    User,
    Mail,
    Lock,
    Phone,
    Calendar,
    Loader2,
    AlertCircle,
    CheckCircle,
    Users
} from 'lucide-react';

const RegisterUser = () => {
    const [userType, setUserType] = useState('student'); // 'student' or 'instructor'
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        phone: '',
        age: '',
        gender: 'not-specified',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'age' ? (value ? parseInt(value, 10) : '') : value,
        }));
    };

    const resetForm = () => {
        setFormData({
            username: '',
            email: '',
            password: '',
            phone: '',
            age: '',
            gender: 'not-specified',
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        // Validation
        if (!formData.username || !formData.email || !formData.password || !formData.phone || !formData.age) {
            setError('All fields are required');
            setLoading(false);
            return;
        }

        if (formData.password.length < 8) {
            setError('Password must be at least 8 characters');
            setLoading(false);
            return;
        }

        try {
            const endpoint = userType === 'student'
                ? '/admin/register/student'
                : '/admin/register/instructor';

            await adminApi.post(endpoint, formData);

            setSuccess(`${userType.charAt(0).toUpperCase() + userType.slice(1)} registered successfully!`);
            resetForm();

            // Clear success message after 3 seconds
            setTimeout(() => setSuccess(''), 3000);

        } catch (err) {
            console.error('Registration error:', err);
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Page Title */}
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-cyan-400 mb-2">Register User</h1>
                <p className="text-gray-400">Add new students or instructors to the platform</p>
            </div>

            {/* Form Card */}
            <div className="bg-[#0d1717] border border-[#1a3333] rounded-xl p-6 md:p-8">

                {/* User Type Toggle */}
                <div className="flex gap-2 mb-8 p-1 bg-[#0a0f0f] rounded-lg">
                    <button
                        type="button"
                        onClick={() => setUserType('student')}
                        className={`flex-1 py-3 px-4 rounded-md font-medium transition-all flex items-center justify-center gap-2 ${userType === 'student'
                            ? 'bg-cyan-400 text-[#0a0f0f]'
                            : 'text-gray-400 hover:text-white'
                            }`}
                    >
                        <GraduationCap className="w-5 h-5" />
                        Register Student
                    </button>
                    <button
                        type="button"
                        onClick={() => setUserType('instructor')}
                        className={`flex-1 py-3 px-4 rounded-md font-medium transition-all flex items-center justify-center gap-2 ${userType === 'instructor'
                            ? 'bg-cyan-400 text-[#0a0f0f]'
                            : 'text-gray-400 hover:text-white'
                            }`}
                    >
                        <Users className="w-5 h-5" />
                        Register Instructor
                    </button>
                </div>

                {/* Success Message */}
                {success && (
                    <div className="mb-6 p-4 bg-green-500/10 border border-green-500/50 rounded-lg flex items-center gap-3 text-green-400">
                        <CheckCircle className="w-5 h-5 flex-shrink-0" />
                        <span>{success}</span>
                    </div>
                )}

                {/* Error Message */}
                {error && (
                    <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg flex items-center gap-3 text-red-400">
                        <AlertCircle className="w-5 h-5 flex-shrink-0" />
                        <span>{error}</span>
                    </div>
                )}

                {/* Registration Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Username */}
                    <div>
                        <label className="flex items-center gap-2 text-sm text-gray-400 mb-1.5">
                            <User className="w-4 h-4" />
                            Username
                        </label>
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            placeholder="Enter username (5-20 characters)"
                            minLength={5}
                            maxLength={20}
                            className="w-full px-4 py-3 bg-[#0a0f0f] border border-[#1a3333] rounded-lg text-white placeholder-gray-500 focus:border-cyan-400 focus:outline-none transition-colors"
                        />
                    </div>

                    {/* Email */}
                    <div>
                        <label className="flex items-center gap-2 text-sm text-gray-400 mb-1.5">
                            <Mail className="w-4 h-4" />
                            Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Enter email address"
                            className="w-full px-4 py-3 bg-[#0a0f0f] border border-[#1a3333] rounded-lg text-white placeholder-gray-500 focus:border-cyan-400 focus:outline-none transition-colors"
                        />
                    </div>

                    {/* Password */}
                    <div>
                        <label className="flex items-center gap-2 text-sm text-gray-400 mb-1.5">
                            <Lock className="w-4 h-4" />
                            Password
                        </label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Enter password (min 8 characters)"
                            minLength={8}
                            className="w-full px-4 py-3 bg-[#0a0f0f] border border-[#1a3333] rounded-lg text-white placeholder-gray-500 focus:border-cyan-400 focus:outline-none transition-colors"
                        />
                    </div>

                    {/* Phone & Age Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="flex items-center gap-2 text-sm text-gray-400 mb-1.5">
                                <Phone className="w-4 h-4" />
                                Phone
                            </label>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="Enter phone number"
                                className="w-full px-4 py-3 bg-[#0a0f0f] border border-[#1a3333] rounded-lg text-white placeholder-gray-500 focus:border-cyan-400 focus:outline-none transition-colors"
                            />
                        </div>

                        <div>
                            <label className="flex items-center gap-2 text-sm text-gray-400 mb-1.5">
                                <Calendar className="w-4 h-4" />
                                Age
                            </label>
                            <input
                                type="number"
                                name="age"
                                value={formData.age}
                                onChange={handleChange}
                                placeholder="Enter age"
                                min={13}
                                className="w-full px-4 py-3 bg-[#0a0f0f] border border-[#1a3333] rounded-lg text-white placeholder-gray-500 focus:border-cyan-400 focus:outline-none transition-colors"
                            />
                        </div>
                    </div>

                    {/* Gender */}
                    <div>
                        <label className="block text-sm text-gray-400 mb-1.5">Gender</label>
                        <div className="flex gap-3">
                            {[
                                { value: 'male', label: 'Male' },
                                { value: 'female', label: 'Female' },
                                { value: 'not-specified', label: 'Not Specified' },
                            ].map((option) => (
                                <button
                                    key={option.value}
                                    type="button"
                                    onClick={() => setFormData(prev => ({ ...prev, gender: option.value }))}
                                    className={`flex-1 py-2 px-3 rounded-lg border text-sm transition-all ${formData.gender === option.value
                                        ? 'bg-cyan-400/20 border-cyan-400 text-cyan-400'
                                        : 'bg-[#0a0f0f] border-[#1a3333] text-gray-400 hover:border-gray-500'
                                        }`}
                                >
                                    {option.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 bg-cyan-400 hover:bg-cyan-500 text-[#0a0f0f] font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mt-6"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Registering...
                            </>
                        ) : (
                            <>
                                <UserPlus className="w-5 h-5" />
                                Register {userType.charAt(0).toUpperCase() + userType.slice(1)}
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default RegisterUser;
