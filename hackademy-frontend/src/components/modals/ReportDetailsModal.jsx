import { X, FileText, MessageSquare, Star, Clock, ExternalLink, Paperclip } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ReportDetailsModal = ({ report, onClose }) => {
    const navigate = useNavigate();

    if (!report) return null;

    const handleViewFullReport = () => {
        onClose();
        navigate(`/reports/${report._id}`);
    };

    const hasAttachments = report.attachments && report.attachments.length > 0;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-[#0d1717] border border-[#1a3333] w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="p-6 border-b border-[#1a3333] flex items-center justify-between bg-[#0a0f0f]">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-cyan-400/20 rounded-full flex items-center justify-center">
                            <FileText className="w-5 h-5 text-cyan-400" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white capitalize">{report.title}</h2>
                            <p className="text-gray-400 text-sm">Level {report.level} • {new Date(report.submittedAt || report.createdAt).toLocaleDateString()}</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-[#1a3333] rounded-lg transition-colors text-gray-400 hover:text-white"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto space-y-6">
                    {/* Submission Content */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                            <FileText className="w-4 h-4" />
                            Your Submission
                        </h3>
                        <div className="bg-[#0a0f0f] border border-[#1a3333] rounded-xl p-4 font-mono text-sm text-cyan-50/90 whitespace-pre-wrap">
                            {report.content}
                        </div>
                    </div>

                    {/* Attachments Indicator */}
                    {hasAttachments && (
                        <div className="flex items-center gap-2 p-3 bg-cyan-400/10 border border-cyan-400/20 rounded-lg">
                            <Paperclip className="w-4 h-4 text-cyan-400" />
                            <span className="text-cyan-400 text-sm">
                                {report.attachments.length} attachment{report.attachments.length !== 1 ? 's' : ''} available
                            </span>
                            <button
                                onClick={handleViewFullReport}
                                className="ml-auto text-xs text-cyan-400 underline hover:no-underline"
                            >
                                View in full report →
                            </button>
                        </div>
                    )}

                    {/* Instructor Feedback */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                                <MessageSquare className="w-4 h-4 text-cyan-400" />
                                Instructor Feedback
                            </h3>
                            <div className={`p-5 rounded-xl border ${report.feedback ? 'bg-cyan-400/5 border-cyan-400/20 text-cyan-100' : 'bg-[#0d1717] border-[#1a3333] text-gray-500 italic'}`}>
                                {report.feedback || "Pending review from your instructor..."}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                                <Star className="w-4 h-4 text-yellow-400" />
                                Score
                            </h3>
                            <div className="bg-[#0a0f0f] border border-[#1a3333] rounded-xl p-6 flex flex-col items-center justify-center">
                                {report.score ? (
                                    <>
                                        <div className="text-4xl font-black text-cyan-400">
                                            {typeof report.score === 'object' ? report.score.score : report.score}/100
                                        </div>
                                        <div className="text-xs text-gray-500 mt-2">Graded on {new Date(report.updatedAt).toLocaleDateString()}</div>
                                    </>
                                ) : (
                                    <div className="text-gray-500 flex flex-col items-center">
                                        <Clock className="w-8 h-8 mb-2 opacity-20" />
                                        <span>Not yet graded</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-[#1a3333] bg-[#0a0f0f] flex justify-between items-center">
                    <button
                        onClick={handleViewFullReport}
                        className="px-4 py-2 bg-cyan-400/10 hover:bg-cyan-400/20 text-cyan-400 rounded-lg font-medium transition-colors flex items-center gap-2"
                    >
                        <ExternalLink className="w-4 h-4" />
                        View Full Report
                    </button>
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-[#1a3333] hover:bg-[#254444] text-white rounded-lg font-medium transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ReportDetailsModal;

