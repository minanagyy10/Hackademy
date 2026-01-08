import { Router } from 'express';
import { auth } from '../../middlewares/auth.middleware.js';
import { Badge } from '../../db/models/badge.model.js';
import { Student } from '../../db/models/student.model.js';
import { checkAndAwardBadges } from '../../utils/badgeSystem.js';

const router = Router();

/**
 * GET /api/badges
 * Get all badges (public, for displaying the badge grid)
 */
router.get('/', async (req, res) => {
    try {
        const badges = await Badge.find({ isActive: true })
            .sort({ displayOrder: 1 })
            .lean();

        return res.status(200).json({
            message: 'Badges retrieved successfully',
            badges,
            total: badges.length
        });
    } catch (error) {
        console.error('Error fetching badges:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

/**
 * GET /api/badges/student
 * Get current student's earned badges (requires auth)
 */
router.get('/student', auth(), async (req, res) => {
    try {
        const studentId = req.user._id;

        // Get all badges
        const allBadges = await Badge.find({ isActive: true })
            .sort({ displayOrder: 1 })
            .lean();

        // Get student's earned badges
        const student = await Student.findById(studentId)
            .populate('earnedBadges.badge')
            .select('earnedBadges stats')
            .lean();

        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        // Map earned badge IDs for quick lookup
        const earnedBadgeMap = new Map();
        student.earnedBadges.forEach(eb => {
            if (eb.badge) {
                earnedBadgeMap.set(eb.badge._id.toString(), eb.earnedAt);
            }
        });

        // Create response with earned status
        const badgesWithStatus = allBadges.map(badge => ({
            ...badge,
            earned: earnedBadgeMap.has(badge._id.toString()),
            earnedAt: earnedBadgeMap.get(badge._id.toString()) || null
        }));

        return res.status(200).json({
            message: 'Student badges retrieved successfully',
            badges: badgesWithStatus,
            earnedCount: student.earnedBadges.length,
            totalCount: allBadges.length,
            stats: student.stats
        });

    } catch (error) {
        console.error('Error fetching student badges:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

/**
 * POST /api/badges/check
 * Manually trigger badge check for current student
 */
router.post('/check', auth(), async (req, res) => {
    try {
        const studentId = req.user._id;

        // Run badge check
        const newBadges = await checkAndAwardBadges(studentId, 'manual_check');

        return res.status(200).json({
            message: newBadges.length > 0
                ? `Congratulations! You earned ${newBadges.length} new badge(s)!`
                : 'No new badges earned. Keep working!',
            newBadges: newBadges.map(b => ({
                name: b.name,
                description: b.description,
                icon: b.icon,
                category: b.category,
                rarity: b.rarity
            }))
        });

    } catch (error) {
        console.error('Error checking badges:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

/**
 * GET /api/badges/leaderboard
 * Get top badge earners
 */
router.get('/leaderboard', async (req, res) => {
    try {
        const topEarners = await Student.find({})
            .select('username earnedBadges totalScore')
            .populate('earnedBadges.badge', 'name icon category rarity')
            .sort({ 'earnedBadges': -1 })
            .limit(10)
            .lean();

        const leaderboard = topEarners.map((student, index) => ({
            rank: index + 1,
            username: student.username,
            badgeCount: student.earnedBadges.length,
            totalScore: student.totalScore,
            topBadges: student.earnedBadges
                .slice(0, 3)
                .map(eb => eb.badge)
                .filter(Boolean)
        }));

        return res.status(200).json({
            message: 'Badge leaderboard retrieved',
            leaderboard
        });

    } catch (error) {
        console.error('Error fetching badge leaderboard:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

export default router;
