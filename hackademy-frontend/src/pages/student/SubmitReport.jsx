import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { mainApi } from '../../api/axiosConfig';
import {
    Send,
    FileText,
    Layers,
    Loader2,
    AlertCircle,
    CheckCircle,
    Upload,
    X,
    Image,
    File
} from 'lucide-react';

const SubmitReport = () => {
    const navigate = useNavigate();
    const fileInputRef = useRef(null);

    const [formData, setFormData] = useState({
        title: '',
        level: 1,
        content: '',
    });
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);

    // Allowed file types
    const ALLOWED_TYPES = ['image/png', 'image/jpg', 'image/jpeg', 'application/pdf'];
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
    const MAX_FILES = 5;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'level' ? parseInt(value, 10) : value,
        }));
    };

    const handleFileSelect = (e) => {
        const selectedFiles = Array.from(e.target.files);
        const validFiles = [];
        const errors = [];

        selectedFiles.forEach(file => {
            // Check file type
            if (!ALLOWED_TYPES.includes(file.type)) {
                errors.push(`${file.name}: Invalid file type. Only PNG, JPG, and PDF allowed.`);
                return;
            }
            // Check file size
            if (file.size > MAX_FILE_SIZE) {
                errors.push(`${file.name}: File too large. Maximum size is 5MB.`);
                return;
            }
            // Check total count
            if (files.length + validFiles.length >= MAX_FILES) {
                errors.push(`Maximum ${MAX_FILES} files allowed.`);
                return;
            }
            validFiles.push(file);
        });

        if (errors.length > 0) {
            setError(errors.join('\n'));
        } else {
            setError('');
        }

        setFiles(prev => [...prev, ...validFiles].slice(0, MAX_FILES));

        // Reset input
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const removeFile = (index) => {
        setFiles(prev => prev.filter((_, i) => i !== index));
    };

    const getFileIcon = (file) => {
        if (file.type.startsWith('image/')) {
            return <Image className="w-5 h-5 text-cyan-400" />;
        }
        return <File className="w-5 h-5 text-orange-400" />;
    };

    const formatFileSize = (bytes) => {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        setUploadProgress(0);

        // Validation
        if (!formData.title.trim()) {
            setError('Title is required');
            setLoading(false);
            return;
        }
        if (!formData.content.trim()) {
            setError('Content is required');
            setLoading(false);
            return;
        }

        try {
            // Create FormData for file upload
            const submitData = new FormData();
            submitData.append('title', formData.title.trim());
            submitData.append('level', formData.level);
            submitData.append('content', formData.content.trim());

            // Append files
            files.forEach(file => {
                submitData.append('attachments', file);
            });

            await mainApi.post('/api/students/submitReport', submitData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                onUploadProgress: (progressEvent) => {
                    const progress = Math.round(
                        (progressEvent.loaded * 100) / progressEvent.total
                    );
                    setUploadProgress(progress);
                }
            });

            setSuccess(true);

            // Redirect after 2 seconds
            setTimeout(() => {
                navigate('/student/dashboard');
            }, 2000);

        } catch (err) {
            console.error('Submit report error:', err);
            setError(
                err.response?.data?.message ||
                'Failed to submit report. Please try again.'
            );
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="text-center">
                    <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="w-10 h-10 text-green-500" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">Report Submitted!</h2>
                    <p className="text-gray-400">Redirecting to your dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Page Title */}
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-cyan-400 mb-2">Submit Report</h1>
                <p className="text-gray-400">
                    Submit your vulnerability report with evidence for review by your instructor
                </p>
            </div>

            {/* Form Card */}
            <div className="bg-[#0d1717] border border-[#1a3333] rounded-xl p-6 md:p-8">

                {/* Error Message */}
                {error && (
                    <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg flex items-start gap-3 text-red-400">
                        <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                        <span className="whitespace-pre-line">{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Title Field */}
                    <div>
                        <label className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                            <FileText className="w-4 h-4" />
                            Report Title
                        </label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="e.g., SQL Injection Vulnerability Report"
                            maxLength={100}
                            className="w-full px-4 py-3 bg-[#0a0f0f] border border-[#1a3333] rounded-lg text-white placeholder-gray-500 focus:border-cyan-400 focus:outline-none transition-colors"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            {formData.title.length}/100 characters
                        </p>
                    </div>

                    {/* Level Field */}
                    <div>
                        <label className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                            <Layers className="w-4 h-4" />
                            Task Level
                        </label>
                        <div className="grid grid-cols-3 gap-3">
                            {[1, 2, 3].map((level) => (
                                <button
                                    key={level}
                                    type="button"
                                    onClick={() => setFormData(prev => ({ ...prev, level }))}
                                    className={`p-4 rounded-lg border transition-all ${formData.level === level
                                        ? 'bg-cyan-400/20 border-cyan-400 text-cyan-400'
                                        : 'bg-[#0a0f0f] border-[#1a3333] text-gray-400 hover:border-gray-500'
                                        }`}
                                >
                                    <div className="text-lg font-bold mb-1">LV.{level}</div>
                                    <div className="text-xs">
                                        {level === 1 && 'Cyber Security Assessment'}
                                        {level === 2 && 'Intrusion Detection'}
                                        {level === 3 && 'Incident Response'}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Content Field */}
                    <div>
                        <label className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                            <FileText className="w-4 h-4" />
                            Report Content
                        </label>
                        <textarea
                            name="content"
                            value={formData.content}
                            onChange={handleChange}
                            placeholder="Describe the vulnerability you found, steps to reproduce, impact assessment, and recommended remediation..."
                            rows={10}
                            className="w-full px-4 py-3 bg-[#0a0f0f] border border-[#1a3333] rounded-lg text-white placeholder-gray-500 focus:border-cyan-400 focus:outline-none transition-colors resize-none"
                        />
                    </div>

                    {/* File Upload Section */}
                    <div>
                        <label className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                            <Upload className="w-4 h-4" />
                            Evidence Attachments (Optional)
                        </label>

                        {/* Drop Zone */}
                        <div
                            className="border-2 border-dashed border-[#1a3333] rounded-lg p-6 text-center hover:border-cyan-400/50 transition-colors cursor-pointer"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <input
                                ref={fileInputRef}
                                type="file"
                                multiple
                                accept=".png,.jpg,.jpeg,.pdf"
                                onChange={handleFileSelect}
                                className="hidden"
                            />
                            <Upload className="w-10 h-10 text-gray-500 mx-auto mb-3" />
                            <p className="text-gray-400 mb-1">
                                Click to upload or drag and drop
                            </p>
                            <p className="text-xs text-gray-500">
                                PNG, JPG, or PDF (max 5MB each, up to 5 files)
                            </p>
                        </div>

                        {/* Selected Files List */}
                        {files.length > 0 && (
                            <div className="mt-4 space-y-2">
                                {files.map((file, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center justify-between p-3 bg-[#0a0f0f] border border-[#1a3333] rounded-lg"
                                    >
                                        <div className="flex items-center gap-3">
                                            {getFileIcon(file)}
                                            <div>
                                                <p className="text-sm text-white truncate max-w-[200px]">
                                                    {file.name}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    {formatFileSize(file.size)}
                                                </p>
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => removeFile(index)}
                                            className="p-1 hover:bg-red-500/20 rounded transition-colors"
                                        >
                                            <X className="w-4 h-4 text-red-400" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Upload Progress */}
                    {loading && uploadProgress > 0 && (
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm text-gray-400">
                                <span>Uploading...</span>
                                <span>{uploadProgress}%</span>
                            </div>
                            <div className="w-full bg-[#0a0f0f] rounded-full h-2">
                                <div
                                    className="bg-cyan-400 h-2 rounded-full transition-all duration-300"
                                    style={{ width: `${uploadProgress}%` }}
                                />
                            </div>
                        </div>
                    )}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 bg-cyan-400 hover:bg-cyan-500 text-[#0a0f0f] font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                {files.length > 0 ? 'Uploading...' : 'Submitting...'}
                            </>
                        ) : (
                            <>
                                <Send className="w-5 h-5" />
                                Submit Report
                            </>
                        )}
                    </button>
                </form>

                {/* Info Note */}
                <p className="text-center text-gray-500 text-sm mt-6">
                    Your report will be automatically sent to your assigned instructor for review.
                </p>
            </div>
        </div>
    );
};

export default SubmitReport;
