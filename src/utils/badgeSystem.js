import { Badge } from '../db/models/badge.model.js';
import { Student } from '../db/models/student.model.js';
import { Report } from '../db/models/report.model.js';

/**
 * Badge System Utility
 * Checks and awards badges to students based on their activity
 */

/**
 * Main function to check and award badges
 * Call this after key events (report submission, grading, receiving comments)
 * @param {string} studentId - The student's ObjectId
 * @param {string} eventType - Type of event that triggered the check
 * @returns {Array} - Array of newly earned badges
 */
export const checkAndAwardBadges = async (studentId, eventType = 'general') => {
    try {
        // Fetch student with current badges
        const student = await Student.findById(studentId)
            .populate('earnedBadges.badge')
            .populate('reports');

        if (!student) {
            console.error('Badge check: Student not found');
            return [];
        }

        // Get all active badges
        const allBadges = await Badge.find({ isActive: true });

        // Get IDs of already earned badges
        const earnedBadgeIds = student.earnedBadges.map(eb => eb.badge?._id?.toString());

        // Filter to unearnedBadges
        const unearnedBadges = allBadges.filter(badge =>
            !earnedBadgeIds.includes(badge._id.toString())
        );

        // Fetch student stats
        const stats = await getStudentStats(studentId, student);

        // Check each unearned badge
        const newlyEarnedBadges = [];

        for (const badge of unearnedBadges) {
            const earned = await checkBadgeCriteria(badge, stats, student);

            if (earned) {
                // Award the badge
                await Student.findByIdAndUpdate(studentId, {
                    $push: {
                        earnedBadges: {
                            badge: badge._id,
                            earnedAt: new Date()
                        }
                    }
                });

                newlyEarnedBadges.push(badge);
                console.log(`🏆 Badge awarded to ${student.username}: ${badge.name}`);
            }
        }

        return newlyEarnedBadges;

    } catch (error) {
        console.error('Badge check error:', error);
        return [];
    }
};

/**
 * Get comprehensive stats for a student
 */
async function getStudentStats(studentId, student) {
    // Get all reports with scores
    const reports = await Report.find({ student: studentId })
        .populate('score')
        .lean();

    // Calculate stats
    const gradedReports = reports.filter(r => r.score);
    const scores = gradedReports.map(r => r.score?.score || 0);

    // Count reports by level
    const reportsAtLevel3 = reports.filter(r => parseInt(r.level) === 3).length;

    // Count instructor comments on student's reports
    let instructorCommentsReceived = 0;
    for (const report of reports) {
        if (report.comments) {
            instructorCommentsReceived += report.comments.filter(c => c.authorRole === 'instructor').length;
        }
    }

    // Get leaderboard position
    const allStudents = await Student.find({})
        .select('totalScore')
        .sort({ totalScore: -1 })
        .lean();

    const leaderboardRank = allStudents.findIndex(s => s._id.toString() === studentId) + 1;

    // Calculate consecutive graded reports with score >= 70
    let consecutiveGood = 0;
    let tempConsecutive = 0;
    const sortedGraded = gradedReports.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));
    for (const r of sortedGraded) {
        if (r.score?.score >= 70) {
            tempConsecutive++;
            consecutiveGood = Math.max(consecutiveGood, tempConsecutive);
        } else {
            tempConsecutive = 0;
        }
    }

    return {
        totalReports: reports.length,
        reportsAtLevel3,
        totalScore: student.totalScore || 0,
        gradedReportsCount: gradedReports.length,
        highestSingleScore: scores.length > 0 ? Math.max(...scores) : 0,
        instructorCommentsReceived,
        leaderboardRank,
        consecutiveGoodReports: consecutiveGood,
        hasReceivedScore: gradedReports.length > 0,
        submissionStreak: student.stats?.submissionStreak || 0,
        // For time-based badges, check latest report submission time
        lastSubmissionHour: reports.length > 0
            ? new Date(reports[reports.length - 1].submittedAt).getHours()
            : null
    };
}

/**
 * Check if a badge criteria is met
 */
async function checkBadgeCriteria(badge, stats, student) {
    switch (badge.criteriaType) {
        case 'REPORT_COUNT':
            return stats.totalReports >= badge.criteriaValue;

        case 'REPORT_COUNT_LEVEL':
            // For Bug Hunter: 5 reports at level 3
            if (badge.criteriaLevel === 3) {
                return stats.reportsAtLevel3 >= badge.criteriaValue;
            }
            return false;

        case 'SCORE_THRESHOLD':
            return stats.totalScore >= badge.criteriaValue;

        case 'SINGLE_SCORE':
            return stats.highestSingleScore >= badge.criteriaValue;

        case 'STREAK':
            return stats.consecutiveGoodReports >= badge.criteriaValue;

        case 'INSTRUCTOR_COMMENTS':
            return stats.instructorCommentsReceived >= badge.criteriaValue;

        case 'FIRST_ACTION':
            // First Blood (1 report), Getting Started (first score)
            if (badge.name === 'First Blood') {
                return stats.totalReports >= 1;
            }
            if (badge.name === 'Getting Started') {
                return stats.hasReceivedScore;
            }
            return false;

        case 'LEADERBOARD_RANK':
            // Hall of Fame: #1 on leaderboard
            return stats.leaderboardRank === badge.criteriaValue;

        case 'SUBMISSION_STREAK':
            return stats.submissionStreak >= badge.criteriaValue;

        case 'TIME_BASED':
            // Early Bird: before 8 AM, Night Owl: after midnight
            if (stats.lastSubmissionHour !== null) {
                if (badge.criteriaTimeStart !== null && badge.criteriaTimeEnd !== null) {
                    if (badge.criteriaTimeStart < badge.criteriaTimeEnd) {
                        return stats.lastSubmissionHour >= badge.criteriaTimeStart &&
                            stats.lastSubmissionHour < badge.criteriaTimeEnd;
                    } else {
                        // Wrap around (e.g., 22:00 to 06:00)
                        return stats.lastSubmissionHour >= badge.criteriaTimeStart ||
                            stats.lastSubmissionHour < badge.criteriaTimeEnd;
                    }
                }
            }
            return false;

        case 'SPECIAL':
            // Legend badge: has all other badges
            if (badge.name === 'Legend') {
                const totalBadges = await Badge.countDocuments({ isActive: true, name: { $ne: 'Legend' } });
                return student.earnedBadges.length >= totalBadges;
            }
            return false;

        default:
            return false;
    }
}

/**
 * Update student stats when a report is submitted
 */
export const updateStatsOnReportSubmission = async (studentId, reportLevel) => {
    try {
        const student = await Student.findById(studentId);
        if (!student) return;

        const now = new Date();
        const lastSubmission = student.stats?.lastSubmissionDate;

        // Check if this is a consecutive day submission
        let newStreak = 1;
        if (lastSubmission) {
            const daysDiff = Math.floor((now - new Date(lastSubmission)) / (1000 * 60 * 60 * 24));
            if (daysDiff === 1) {
                newStreak = (student.stats?.submissionStreak || 0) + 1;
            } else if (daysDiff === 0) {
                newStreak = student.stats?.submissionStreak || 1;
            }
        }

        const updateData = {
            $inc: {
                'stats.totalReportsSubmitted': 1
            },
            $set: {
                'stats.submissionStreak': newStreak,
                'stats.lastSubmissionDate': now
            }
        };

        // Track level 3 reports
        if (parseInt(reportLevel) === 3) {
            updateData.$inc['stats.reportsAtLevel3'] = 1;
        }

        await Student.findByIdAndUpdate(studentId, updateData);

    } catch (error) {
        console.error('Error updating stats on submission:', error);
    }
};

/**
 * Update stats when an instructor comments on a student's report
 */
export const updateStatsOnInstructorComment = async (studentId) => {
    try {
        await Student.findByIdAndUpdate(studentId, {
            $inc: { 'stats.instructorCommentsReceived': 1 }
        });
    } catch (error) {
        console.error('Error updating instructor comment stats:', error);
    }
};

/**
 * Update stats when a report is graded
 */
export const updateStatsOnGrading = async (studentId, score) => {
    try {
        const student = await Student.findById(studentId);
        if (!student) return;

        const updateData = {};

        // Update highest single score if this is higher
        if (score > (student.stats?.highestSingleScore || 0)) {
            updateData['stats.highestSingleScore'] = score;
        }

        // Update consecutive good reports
        if (score >= 70) {
            updateData['stats.consecutiveGradedReports'] = (student.stats?.consecutiveGradedReports || 0) + 1;
        } else {
            updateData['stats.consecutiveGradedReports'] = 0;
        }

        if (Object.keys(updateData).length > 0) {
            await Student.findByIdAndUpdate(studentId, { $set: updateData });
        }

    } catch (error) {
        console.error('Error updating grading stats:', error);
    }
};

export default {
    checkAndAwardBadges,
    updateStatsOnReportSubmission,
    updateStatsOnInstructorComment,
    updateStatsOnGrading
};
