import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { mainApi } from '../../api/axiosConfig';
import { useAuth } from '../../context/AuthContext';
import {
    ArrowLeft,
    FileText,
    Image,
    File,
    Download,
    Send,
    Loader2,
    AlertCircle,
    User,
    GraduationCap,
    Clock,
    Award,
    MessageSquare,
    Paperclip
} from 'lucide-react';

const ReportDetails = () => {
    const { reportId } = useParams();
    const navigate = useNavigate();
    const { role, user } = useAuth();
    const commentsEndRef = useRef(null);

    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Comments state
    const [newComment, setNewComment] = useState('');
    const [submittingComment, setSubmittingComment] = useState(false);
    const [commentError, setCommentError] = useState('');

    // Base URL for attachments
    const API_BASE_URL = 'http://localhost:9999';

    useEffect(() => {
        fetchReport();
    }, [reportId]);

    useEffect(() => {
        // Scroll to bottom when comments change
        scrollToBottom();
    }, [report?.comments]);

    const scrollToBottom = () => {
        commentsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const fetchReport = async () => {
        try {
            setLoading(true);
            const response = await mainApi.get(`/api/reports/${reportId}`);
            setReport(response.data.report);
        } catch (err) {
            console.error('Fetch report error:', err);
            setError(err.response?.data?.message || 'Failed to load report');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmitComment = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        setSubmittingComment(true);
        setCommentError('');

        try {
            const response = await mainApi.post(`/api/reports/${reportId}/comments`, {
                content: newComment.trim()
            });

            // Add the new comment to the report's comments
            setReport(prev => ({
                ...prev,
                comments: [...(prev.comments || []), response.data.comment]
            }));

            setNewComment('');
        } catch (err) {
            console.error('Submit comment error:', err);
            setCommentError(err.response?.data?.message || 'Failed to add comment');
        } finally {
            setSubmittingComment(false);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatFileSize = (bytes) => {
        if (!bytes) return '';
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    };

    const isImage = (mimetype) => {
        return mimetype?.startsWith('image/');
    };

    // Get secure attachment URL (uses authenticated API endpoint)
    const getSecureAttachmentUrl = (attachment) => {
        const token = localStorage.getItem('accessToken');
        // The secure endpoint requires authentication via the Authorization header
        // For direct links, we'll use a URL that triggers file download through the API
        return `${API_BASE_URL}/api/reports/${reportId}/attachments/${attachment.filename}`;
    };

    // Handle attachment download with authentication
    const handleAttachmentDownload = async (attachment) => {
        try {
            const response = await mainApi.get(
                `/api/reports/${reportId}/attachments/${attachment.filename}`,
                { responseType: 'blob' }
            );

            // Create download link with correct MIME type
            const blob = new Blob([response.data], { type: attachment.mimetype });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            // Use originalName which has the correct extension (e.g., "report.pdf", "image.png")
            link.setAttribute('download', attachment.originalName);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (err) {
            console.error('Download error:', err);
            setError('Failed to download attachment');
        }
    };

    // For image preview - use blob URL with auth
    const [imageUrls, setImageUrls] = useState({});

    useEffect(() => {
        // Fetch image previews with authentication
        const fetchImagePreviews = async () => {
            if (!report?.attachments) return;

            const urls = {};
            for (const att of report.attachments) {
                if (isImage(att.mimetype)) {
                    try {
                        const response = await mainApi.get(
                            `/api/reports/${reportId}/attachments/${att.filename}`,
                            { responseType: 'blob' }
                        );
                        urls[att.filename] = window.URL.createObjectURL(new Blob([response.data]));
                    } catch (err) {
                        console.error('Failed to load image:', att.filename);
                    }
                }
            }
            setImageUrls(urls);
        };

        fetchImagePreviews();

        // Cleanup blob URLs on unmount
        return () => {
            Object.values(imageUrls).forEach(url => window.URL.revokeObjectURL(url));
        };
    }, [report?.attachments, reportId]);

    if (loading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <Loader2 className="w-10 h-10 text-cyan-400 animate-spin" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-8">
                <div className="p-6 bg-red-500/10 border border-red-500/50 rounded-xl flex items-center gap-4 text-red-400">
                    <AlertCircle className="w-8 h-8 flex-shrink-0" />
                    <div>
                        <h2 className="text-lg font-semibold">Error Loading Report</h2>
                        <p>{error}</p>
                    </div>
                </div>
                <button
                    onClick={() => navigate(-1)}
                    className="mt-4 flex items-center gap-2 text-gray-400 hover:text-cyan-400 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Go Back
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Back Button */}
            <button
                onClick={() => navigate(-1)}
                className="mb-6 flex items-center gap-2 text-gray-400 hover:text-cyan-400 transition-colors"
            >
                <ArrowLeft className="w-4 h-4" />
                Back to Reports
            </button>

            {/* Report Header */}
            <div className="bg-[#0d1717] border border-[#1a3333] rounded-xl p-6 mb-6">
                <div className="flex items-start justify-between mb-4">
                    <div>
                        <h1 className="text-2xl font-bold text-white capitalize mb-2">
                            {report.title}
                        </h1>
                        <div className="flex items-center gap-4 text-sm text-gray-400">
                            <span className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                {formatDate(report.submittedAt || report.createdAt)}
                            </span>
                            <span className="px-2 py-0.5 bg-cyan-400/20 text-cyan-400 rounded">
                                Level {report.level}
                            </span>
                        </div>
                    </div>
                    {report.score && (
                        <div className="flex items-center gap-2 px-4 py-2 bg-green-500/20 border border-green-500/50 rounded-lg">
                            <Award className="w-5 h-5 text-green-400" />
                            <span className="text-xl font-bold text-green-400">
                                {report.score.score}/100
                            </span>
                        </div>
                    )}
                </div>

                {/* Student/Instructor Info */}
                <div className="flex gap-6 text-sm text-gray-400 mb-4">
                    <div className="flex items-center gap-2">
                        <GraduationCap className="w-4 h-4 text-cyan-400" />
                        <span>Student: </span>
                        <span className="text-white">{report.student?.username || 'Unknown'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-orange-400" />
                        <span>Instructor: </span>
                        <span className="text-white">{report.instructor?.username || 'Unknown'}</span>
                    </div>
                </div>

                {/* Report Content */}
                <div className="border-t border-[#1a3333] pt-4">
                    <h3 className="text-sm text-gray-400 mb-2 flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        Report Content
                    </h3>
                    <div className="prose prose-invert max-w-none">
                        <p className="text-gray-300 whitespace-pre-wrap">{report.content}</p>
                    </div>
                </div>

                {/* Legacy Feedback (if exists) */}
                {report.feedback && (
                    <div className="border-t border-[#1a3333] pt-4 mt-4">
                        <h3 className="text-sm text-gray-400 mb-2">Instructor Feedback</h3>
                        <p className="text-gray-300 bg-orange-500/10 border border-orange-500/30 rounded-lg p-3">
                            {report.feedback}
                        </p>
                    </div>
                )}
            </div>

            {/* Attachments Section */}
            {report.attachments && report.attachments.length > 0 && (
                <div className="bg-[#0d1717] border border-[#1a3333] rounded-xl p-6 mb-6">
                    <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <Paperclip className="w-5 h-5 text-cyan-400" />
                        Evidence Attachments ({report.attachments.length})
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {report.attachments.map((attachment, index) => (
                            <div
                                key={attachment._id || index}
                                className="border border-[#1a3333] rounded-lg overflow-hidden"
                            >
                                {/* Image Preview - uses authenticated blob URL */}
                                {isImage(attachment.mimetype) ? (
                                    <div className="aspect-video bg-[#0a0f0f] flex items-center justify-center">
                                        {imageUrls[attachment.filename] ? (
                                            <img
                                                src={imageUrls[attachment.filename]}
                                                alt={attachment.originalName}
                                                className="max-h-full max-w-full object-contain"
                                            />
                                        ) : (
                                            <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
                                        )}
                                    </div>
                                ) : (
                                    <div className="aspect-video bg-[#0a0f0f] flex items-center justify-center">
                                        <File className="w-16 h-16 text-orange-400" />
                                    </div>
                                )}

                                {/* File Info */}
                                <div className="p-3 bg-[#0a0f0f] flex items-center justify-between">
                                    <div className="flex items-center gap-2 overflow-hidden">
                                        {isImage(attachment.mimetype) ? (
                                            <Image className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                                        ) : (
                                            <File className="w-4 h-4 text-orange-400 flex-shrink-0" />
                                        )}
                                        <div className="overflow-hidden">
                                            <p className="text-sm text-white truncate">
                                                {attachment.originalName}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {formatFileSize(attachment.size)}
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleAttachmentDownload(attachment)}
                                        className="p-2 hover:bg-cyan-400/20 rounded-lg transition-colors"
                                        title="Download file"
                                    >
                                        <Download className="w-4 h-4 text-cyan-400" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Discussion Thread */}
            <div className="bg-[#0d1717] border border-[#1a3333] rounded-xl p-6">
                <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-cyan-400" />
                    Discussion Thread ({report.comments?.length || 0})
                </h2>

                {/* Comments List */}
                <div className="space-y-4 max-h-[400px] overflow-y-auto mb-4 pr-2">
                    {(!report.comments || report.comments.length === 0) ? (
                        <div className="text-center py-8 text-gray-500">
                            <MessageSquare className="w-12 h-12 mx-auto mb-2 opacity-50" />
                            <p>No comments yet. Start the discussion!</p>
                        </div>
                    ) : (
                        report.comments.map((comment, index) => {
                            const isOwnComment = comment.authorRole === role;

                            return (
                                <div
                                    key={comment._id || index}
                                    className={`flex ${isOwnComment ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`max-w-[80%] rounded-xl p-4 ${isOwnComment
                                            ? 'bg-cyan-400/20 border border-cyan-400/30'
                                            : 'bg-[#0a0f0f] border border-[#1a3333]'
                                            }`}
                                    >
                                        <div className="flex items-center gap-2 mb-2">
                                            <div className={`w-6 h-6 rounded-full flex items-center justify-center ${comment.authorRole === 'instructor'
                                                ? 'bg-orange-400/20'
                                                : 'bg-cyan-400/20'
                                                }`}>
                                                {comment.authorRole === 'instructor' ? (
                                                    <User className="w-3 h-3 text-orange-400" />
                                                ) : (
                                                    <GraduationCap className="w-3 h-3 text-cyan-400" />
                                                )}
                                            </div>
                                            <span className={`text-sm font-medium ${comment.authorRole === 'instructor'
                                                ? 'text-orange-400'
                                                : 'text-cyan-400'
                                                }`}>
                                                {comment.authorName}
                                            </span>
                                            <span className="text-xs text-gray-500">
                                                {formatDate(comment.createdAt)}
                                            </span>
                                        </div>
                                        <p className="text-gray-300 whitespace-pre-wrap">
                                            {comment.content}
                                        </p>
                                    </div>
                                </div>
                            );
                        })
                    )}
                    <div ref={commentsEndRef} />
                </div>

                {/* Comment Error */}
                {commentError && (
                    <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm">
                        {commentError}
                    </div>
                )}

                {/* Comment Input */}
                <form onSubmit={handleSubmitComment} className="flex gap-3">
                    <input
                        type="text"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Type your message..."
                        maxLength={2000}
                        className="flex-1 px-4 py-3 bg-[#0a0f0f] border border-[#1a3333] rounded-lg text-white placeholder-gray-500 focus:border-cyan-400 focus:outline-none transition-colors"
                    />
                    <button
                        type="submit"
                        disabled={submittingComment || !newComment.trim()}
                        className="px-6 py-3 bg-cyan-400 hover:bg-cyan-500 text-[#0a0f0f] font-semibold rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {submittingComment ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <Send className="w-5 h-5" />
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ReportDetails;
