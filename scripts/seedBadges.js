/**
 * Seed Script for Badges
 * Run: node scripts/seedBadges.js
 * 
 * Populates the database with 25 unique badges across different tiers
 */

import mongoose from 'mongoose';
import { config } from 'dotenv';
import { Badge } from '../src/db/models/badge.model.js';

config();

const badges = [
    // ==================== BRONZE TIER (5) ====================
    {
        name: 'First Blood',
        description: 'Submit your first report. Every journey begins with a single step.',
        icon: '🩸',
        criteriaType: 'FIRST_ACTION',
        criteriaValue: 1,
        category: 'Bronze',
        rarity: 'common',
        displayOrder: 1
    },
    {
        name: 'Getting Started',
        description: 'Receive your first score from an instructor.',
        icon: '⭐',
        criteriaType: 'FIRST_ACTION',
        criteriaValue: 1,
        category: 'Bronze',
        rarity: 'common',
        displayOrder: 2
    },
    {
        name: 'Early Bird',
        description: 'Submit a report before 8 AM. The early hunter catches the bug.',
        icon: '🌅',
        criteriaType: 'TIME_BASED',
        criteriaValue: 1,
        criteriaTimeStart: 5,  // 5 AM
        criteriaTimeEnd: 8,    // 8 AM
        category: 'Bronze',
        rarity: 'uncommon',
        displayOrder: 3
    },
    {
        name: 'Night Owl',
        description: 'Submit a report after midnight. Hackers never sleep.',
        icon: '🦉',
        criteriaType: 'TIME_BASED',
        criteriaValue: 1,
        criteriaTimeStart: 0,  // Midnight
        criteriaTimeEnd: 5,    // 5 AM
        category: 'Bronze',
        rarity: 'uncommon',
        displayOrder: 4
    },
    {
        name: 'Dedicated',
        description: 'Submit 3 reports. Consistency is key.',
        icon: '📝',
        criteriaType: 'REPORT_COUNT',
        criteriaValue: 3,
        category: 'Bronze',
        rarity: 'common',
        displayOrder: 5
    },

    // ==================== SILVER TIER (5) ====================
    {
        name: 'Pentester',
        description: 'Submit 5 reports. You\'re developing real skills.',
        icon: '🔍',
        criteriaType: 'REPORT_COUNT',
        criteriaValue: 5,
        category: 'Silver',
        rarity: 'uncommon',
        displayOrder: 6
    },
    {
        name: 'Rising Star',
        description: 'Earn 500 total score. Your star is rising.',
        icon: '🌟',
        criteriaType: 'SCORE_THRESHOLD',
        criteriaValue: 500,
        category: 'Silver',
        rarity: 'uncommon',
        displayOrder: 7
    },
    {
        name: 'Consistent',
        description: 'Submit 3 reports in one week. Persistence pays off.',
        icon: '📅',
        criteriaType: 'SUBMISSION_STREAK',
        criteriaValue: 3,
        category: 'Silver',
        rarity: 'uncommon',
        displayOrder: 8
    },
    {
        name: 'Quality Hunter',
        description: 'Get 80+ on a single report. Quality over quantity.',
        icon: '💎',
        criteriaType: 'SINGLE_SCORE',
        criteriaValue: 80,
        category: 'Silver',
        rarity: 'uncommon',
        displayOrder: 9
    },
    {
        name: 'Feedback Receiver',
        description: 'Receive 5 comments from instructors on your reports.',
        icon: '💬',
        criteriaType: 'INSTRUCTOR_COMMENTS',
        criteriaValue: 5,
        category: 'Silver',
        rarity: 'uncommon',
        displayOrder: 10
    },

    // ==================== GOLD TIER (5) ====================
    {
        name: 'Expert Hunter',
        description: 'Submit 10 reports. You\'re becoming an expert.',
        icon: '🎯',
        criteriaType: 'REPORT_COUNT',
        criteriaValue: 10,
        category: 'Gold',
        rarity: 'rare',
        displayOrder: 11
    },
    {
        name: 'High Achiever',
        description: 'Earn 1000 total score. Impressive achievement!',
        icon: '🏅',
        criteriaType: 'SCORE_THRESHOLD',
        criteriaValue: 1000,
        category: 'Gold',
        rarity: 'rare',
        displayOrder: 12
    },
    {
        name: 'Perfectionist',
        description: 'Get 95+ on a single report. Near perfection!',
        icon: '✨',
        criteriaType: 'SINGLE_SCORE',
        criteriaValue: 95,
        category: 'Gold',
        rarity: 'rare',
        displayOrder: 13
    },
    {
        name: 'Streak Master',
        description: 'Get 5 consecutive reports graded 70+.',
        icon: '🔥',
        criteriaType: 'STREAK',
        criteriaValue: 5,
        category: 'Gold',
        rarity: 'rare',
        displayOrder: 14
    },
    {
        name: "Instructor's Favorite",
        description: 'Receive 20 comments from instructors. They love your work!',
        icon: '❤️',
        criteriaType: 'INSTRUCTOR_COMMENTS',
        criteriaValue: 20,
        category: 'Gold',
        rarity: 'rare',
        displayOrder: 15
    },

    // ==================== PLATINUM TIER (5) ====================
    {
        name: 'Elite Hacker',
        description: 'Submit 25 reports. True elite status achieved.',
        icon: '👑',
        criteriaType: 'REPORT_COUNT',
        criteriaValue: 25,
        category: 'Platinum',
        rarity: 'epic',
        displayOrder: 16
    },
    {
        name: 'Top Scorer',
        description: 'Earn 2500 total score. Legendary achievement!',
        icon: '🏆',
        criteriaType: 'SCORE_THRESHOLD',
        criteriaValue: 2500,
        category: 'Platinum',
        rarity: 'epic',
        displayOrder: 17
    },
    {
        name: 'Flawless',
        description: 'Get a perfect 100 on a report. Absolute perfection!',
        icon: '💯',
        criteriaType: 'SINGLE_SCORE',
        criteriaValue: 100,
        category: 'Platinum',
        rarity: 'epic',
        displayOrder: 18
    },
    {
        name: 'Marathon',
        description: 'Get 10 consecutive reports graded. Endurance champion!',
        icon: '🏃',
        criteriaType: 'STREAK',
        criteriaValue: 10,
        category: 'Platinum',
        rarity: 'epic',
        displayOrder: 19
    },
    {
        name: "Mentor's Pride",
        description: 'Receive 50 instructor comments. Your mentor is proud!',
        icon: '🎓',
        criteriaType: 'INSTRUCTOR_COMMENTS',
        criteriaValue: 50,
        category: 'Platinum',
        rarity: 'epic',
        displayOrder: 20
    },

    // ==================== SPECIAL TIER (5) ====================
    {
        name: 'Bug Hunter',
        description: 'Submit 5 reports on Level 3 challenges. Critical bug hunter!',
        icon: '🐛',
        criteriaType: 'REPORT_COUNT_LEVEL',
        criteriaValue: 5,
        criteriaLevel: 3,
        category: 'Special',
        rarity: 'rare',
        displayOrder: 21
    },
    {
        name: 'Speed Demon',
        description: 'Have a report graded within 24 hours of submission.',
        icon: '⚡',
        criteriaType: 'SPECIAL',
        criteriaValue: 1,
        category: 'Special',
        rarity: 'rare',
        displayOrder: 22
    },
    {
        name: 'Unstoppable',
        description: 'Maintain a 7-day submission streak. Unstoppable force!',
        icon: '💪',
        criteriaType: 'SUBMISSION_STREAK',
        criteriaValue: 7,
        category: 'Special',
        rarity: 'epic',
        displayOrder: 23
    },
    {
        name: 'Hall of Fame',
        description: 'Reach #1 on the leaderboard. You are the champion!',
        icon: '🏛️',
        criteriaType: 'LEADERBOARD_RANK',
        criteriaValue: 1,
        category: 'Special',
        rarity: 'legendary',
        displayOrder: 24
    },
    {
        name: 'Legend',
        description: 'Earn all other badges. Ultimate achievement!',
        icon: '🌈',
        criteriaType: 'SPECIAL',
        criteriaValue: 24,
        category: 'Special',
        rarity: 'legendary',
        displayOrder: 25
    }
];

async function seedBadges() {
    try {
        // Connect to database
        await mongoose.connect(process.env.DB_URL);
        console.log('📦 Connected to database');

        // Clear existing badges
        await Badge.deleteMany({});
        console.log('🗑️  Cleared existing badges');

        // Insert new badges
        const inserted = await Badge.insertMany(badges);
        console.log(`✅ Successfully seeded ${inserted.length} badges!`);

        // Display summary
        console.log('\n📊 Badge Summary:');
        console.log('─'.repeat(40));

        const categories = ['Bronze', 'Silver', 'Gold', 'Platinum', 'Special'];
        for (const cat of categories) {
            const catBadges = inserted.filter(b => b.category === cat);
            console.log(`  ${cat}: ${catBadges.length} badges`);
            catBadges.forEach(b => console.log(`    • ${b.icon} ${b.name}`));
        }

        console.log('\n🎉 Seeding complete!');

    } catch (error) {
        console.error('❌ Seeding failed:', error);
    } finally {
        await mongoose.disconnect();
        process.exit(0);
    }
}

seedBadges();
