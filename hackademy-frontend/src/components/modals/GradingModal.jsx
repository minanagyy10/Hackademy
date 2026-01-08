import { useState, useEffect } from 'react';
import { X, Star, MessageSquare, Save, Loader2, AlertCircle, ExternalLink, Paperclip, Image, File, Download } from 'lucide-react';
import { mainApi } from '../../api/axiosConfig';
import { useNavigate } from 'react-router-dom';

const GradingModal = ({ report, onClose, onSuccess }) => {
    const navigate = useNavigate();
    const isEdit = !!report?.score;
    const [score, setScore] = useState(report?.score?.score || report?.score || '');
    const [feedback, setFeedback] = useState(report?.feedback || '');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const API_BASE_URL = 'http://localhost:9999';

    // Synchronize state if report changes
    useEffect(() => {
        if (report) {
            setScore(report?.score?.score || report?.score || '');
            setFeedback(report?.feedback || '');
            setError('');
            setSuccess(false);
        }
    }, [report]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const scoreValue = parseInt(score);
        if (isNaN(scoreValue) || scoreValue < 0 || scoreValue > 100) {
            setError('Score must be between 0 and 100');
            setLoading(false);
            return;
        }

        if (!feedback.trim()) {
            setError('Please provide feedback');
            setLoading(false);
            return;
        }

        try {
            if (isEdit) {
                // Update existing
                const promises = [];

                // Compare with original to decide what to update
                const originalScore = report?.score?.score || report?.score;
                const originalFeedback = report?.feedback;

                if (scoreValue !== originalScore) {
                    promises.push(mainApi.patch('/api/instructors/score', {
                        reportId: report._id,
                        scoreValue
                    }));
                }

                if (feedback.trim() !== originalFeedback) {
                    promises.push(mainApi.patch('/api/instructors/feedback', {
                        reportId: report._id,
                        feedback: feedback.trim()
                    }));
                }

                if (promises.length > 0) {
                    await Promise.all(promises);
                }
            } else {
                // Initial grading
                // In some versions of this backend, these are separate POST calls
                await Promise.all([
                    mainApi.post('/api/instructors/score', {
                        reportId: report._id,
                        scoreValue
                    }),
                    mainApi.post('/api/instructors/review', {
                        reportId: report._id,
                        feedback: feedback.trim()
                    })
                ]);
            }

            setSuccess(true);
            setTimeout(() => {
                onSuccess();
                onClose();
            }, 1500);
        } catch (err) {
            console.error('Submission error:', err);
            setError(err.response?.data?.message || 'Failed to submit grading. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleViewFullReport = () => {
        onClose();
        navigate(`/reports/${report._id}`);
    };

    const isImage = (mimetype) => mimetype?.startsWith('image/');

    if (!report) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-[#111a1a] border border-[#1a3333] w-full max-w-2xl max-h-[90vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col">
                {/* Header */}
                <div className="p-6 border-b border-[#1a3333] flex items-center justify-between bg-[#0a0f0f]">
                    <div>
                        <h2 className="text-xl font-bold text-white capitalize">
                            {isEdit ? 'Update Grading' : 'Grade Report'}
                        </h2>
                        <p className="text-gray-400 text-sm mt-1">{report.title}</p>
                        <p className="text-cyan-400 text-xs mt-1">From: {report.student?.username || 'Unknown'}</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleViewFullReport}
                            className="flex items-center gap-1 px-3 py-1.5 bg-cyan-400/10 hover:bg-cyan-400/20 text-cyan-400 rounded-lg text-sm transition-colors"
                        >
                            <ExternalLink className="w-4 h-4" />
                            View Full Report
                        </button>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-[#1a3333] rounded-lg transition-colors text-gray-400 hover:text-white"
                            disabled={loading}
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                <div className="overflow-y-auto flex-1">
                    {/* Report Content Preview */}
                    <div className="p-4 border-b border-[#1a3333] bg-[#0a0f0f]/50">
                        <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Report Content</p>
                        <div className="bg-black/30 rounded-lg p-3 text-sm text-gray-300 max-h-24 overflow-y-auto">
                            {report.content}
                        </div>
                    </div>

                    {/* Attachments Section */}
                    {report.attachments && report.attachments.length > 0 && (
                        <div className="p-4 border-b border-[#1a3333]">
                            <p className="text-xs text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                                <Paperclip className="w-3 h-3" />
                                Evidence Attachments ({report.attachments.length})
                            </p>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                {report.attachments.map((att, idx) => (
                                    <button
                                        key={att._id || idx}
                                        onClick={async () => {
                                            try {
                                                const response = await mainApi.get(
                                                    `/api/reports/${report._id}/attachments/${att.filename}`,
                                                    { responseType: 'blob' }
                                                );
                                                // Create blob with correct MIME type for proper file extension
                                                const blob = new Blob([response.data], { type: att.mimetype });
                                                const url = window.URL.createObjectURL(blob);
                                                const link = document.createElement('a');
                                                link.href = url;
                                                // originalName has correct extension (e.g., "report.pdf", "image.png")
                                                link.setAttribute('download', att.originalName);
                                                document.body.appendChild(link);
                                                link.click();
                                                link.remove();
                                                window.URL.revokeObjectURL(url);
                                            } catch (err) {
                                                console.error('Download error:', err);
                                            }
                                        }}
                                        className="flex items-center gap-2 p-2 bg-[#0a0f0f] border border-[#1a3333] rounded-lg hover:border-cyan-400/50 transition-colors group text-left"
                                    >
                                        {isImage(att.mimetype) ? (
                                            <Image className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                                        ) : (
                                            <File className="w-4 h-4 text-orange-400 flex-shrink-0" />
                                        )}
                                        <span className="text-xs text-gray-400 truncate group-hover:text-cyan-400">
                                            {att.originalName}
                                        </span>
                                        <Download className="w-3 h-3 text-gray-500 ml-auto opacity-0 group-hover:opacity-100" />
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="p-6 space-y-6">
                        {/* Score Input */}
                        <div className="space-y-4">
                            <label className="text-sm font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                                <Star className={`w-4 h-4 ${score ? 'text-yellow-400' : ''}`} />
                                Assignment Score (0-100)
                            </label>
                            <div className="relative group">
                                <input
                                    type="number"
                                    min="0"
                                    max="100"
                                    value={score}
                                    onChange={(e) => setScore(e.target.value)}
                                    className="w-full bg-[#0a0f0f] border border-[#1a3333] rounded-xl px-4 py-4 text-2xl font-bold text-white placeholder-gray-700 focus:border-cyan-400 focus:outline-none transition-all group-hover:border-[#2a4d4d]"
                                    placeholder="85"
                                    required
                                    disabled={loading || success}
                                />
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold text-xl">
                                    / 100
                                </div>
                            </div>
                        </div>

                        {/* Feedback Input */}
                        <div className="space-y-4">
                            <label className="text-sm font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                                <MessageSquare className="w-4 h-4 text-cyan-400" />
                                Instructor Feedback
                            </label>
                            <textarea
                                value={feedback}
                                onChange={(e) => setFeedback(e.target.value)}
                                rows="4"
                                className="w-full bg-[#0a0f0f] border border-[#1a3333] rounded-xl px-4 py-4 text-white placeholder-gray-700 focus:border-cyan-400 focus:outline-none transition-all resize-none"
                                placeholder="Great job! The PoC is solid, but consider adding more details about the impact..."
                                required
                                disabled={loading || success}
                            />
                        </div>

                        {/* Status Messages */}
                        {error && (
                            <div className="p-4 bg-red-500/10 border border-red-500/50 rounded-lg flex items-center gap-3 text-red-400 text-sm animate-shake">
                                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                                <span>{error}</span>
                            </div>
                        )}

                        {success && (
                            <div className="p-4 bg-green-500/10 border border-green-500/50 rounded-lg flex items-center gap-3 text-green-400 text-sm">
                                <div className="w-2 h-2 bg-green-400 rounded-full animate-ping" />
                                <span>{isEdit ? 'Grading updated successfully!' : 'Report graded successfully!'}</span>
                            </div>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading || success}
                            className={`w-full py-4 rounded-xl flex items-center justify-center gap-2 font-bold transition-all shadow-lg ${success
                                ? 'bg-green-500 text-white cursor-default'
                                : 'bg-cyan-400 text-[#0a0f0f] hover:bg-cyan-500 active:scale-[0.98]'
                                }`}
                        >
                            {loading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : success ? (
                                'Completed'
                            ) : (
                                <>
                                    <Save className="w-5 h-5" />
                                    {isEdit ? 'Update Grading' : 'Submit Grading'}
                                </>
                            )}
                        </button>
                    </form>

                    {/* Info Text */}
                    {!success && !error && (
                        <div className="px-6 pb-6 text-center">
                            <p className="text-xs text-gray-500 italic">
                                Students will see this score and feedback immediately on their dashboard.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default GradingModal;

