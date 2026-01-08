import mongoose from "mongoose";

/**
 * Badge Model for Gamification System
 * Students earn badges based on their activity and achievements
 */
const badgeSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Badge name is required"],
            unique: true,
            trim: true,
            maxlength: [50, "Badge name must be at most 50 characters"]
        },
        description: {
            type: String,
            required: [true, "Description is required"],
            trim: true,
            maxlength: [200, "Description must be at most 200 characters"]
        },
        icon: {
            type: String,
            required: true,
            default: "🏆" // Default emoji, can be URL or emoji
        },
        criteriaType: {
            type: String,
            required: true,
            enum: [
                'REPORT_COUNT',           // Total reports submitted
                'REPORT_COUNT_LEVEL',     // Reports at specific level
                'SCORE_THRESHOLD',        // Total score milestone
                'SINGLE_SCORE',           // Score on single report
                'STREAK',                 // Consecutive graded reports
                'INSTRUCTOR_COMMENTS',    // Comments received from instructor
                'FIRST_ACTION',           // First time doing something
                'LEADERBOARD_RANK',       // Leaderboard position
                'SUBMISSION_STREAK',      // Daily submission streak
                'TIME_BASED',             // Time-based (early bird, night owl)
                'SPECIAL'                 // Special/manual awards
            ]
        },
        criteriaValue: {
            type: Number,
            required: true,
            default: 1
        },
        // For level-specific badges
        criteriaLevel: {
            type: Number,
            default: null
        },
        // For time-based badges
        criteriaTimeStart: {
            type: Number, // Hour in 24h format (0-23)
            default: null
        },
        criteriaTimeEnd: {
            type: Number,
            default: null
        },
        category: {
            type: String,
            required: true,
            enum: ['Bronze', 'Silver', 'Gold', 'Platinum', 'Special'],
            default: 'Bronze'
        },
        rarity: {
            type: String,
            required: true,
            enum: ['common', 'uncommon', 'rare', 'epic', 'legendary'],
            default: 'common'
        },
        // Sort order for display
        displayOrder: {
            type: Number,
            default: 0
        },
        // Is this badge active/earnable?
        isActive: {
            type: Boolean,
            default: true
        }
    },
    { timestamps: true }
);

// Index for efficient queries
badgeSchema.index({ category: 1, displayOrder: 1 });
badgeSchema.index({ criteriaType: 1 });

export const Badge = mongoose.models.Badge || mongoose.model('Badge', badgeSchema);
