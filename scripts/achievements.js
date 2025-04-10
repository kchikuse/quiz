const ACHIEVEMENTS = {
  // Questions answered milestones
  BEGINNER: {
    id: "beginner",
    title: "Beginner",
    description: "Answer your first 10 questions",
    icon: "📚",
    requirement: (stats) => stats.totalQuestionsAnswered >= 10,
    category: "progress",
  },
  SCHOLAR: {
    id: "scholar",
    title: "Scholar",
    description: "Answer 50 questions",
    icon: "🎓",
    requirement: (stats) => stats.totalQuestionsAnswered >= 50,
    category: "progress",
  },
  THEOLOGIAN: {
    id: "theologian",
    title: "Theologian",
    description: "Answer 100 questions",
    icon: "📜",
    requirement: (stats) => stats.totalQuestionsAnswered >= 100,
    category: "progress",
  },
  DEVOTED: {
    id: "devoted",
    title: "Devoted",
    description: "Answer 250 questions",
    icon: "📖",
    requirement: (stats) => stats.totalQuestionsAnswered >= 250,
    category: "progress",
  },
  PROPHET: {
    id: "prophet",
    title: "Prophet",
    description: "Answer 500 questions",
    icon: "🕊️",
    requirement: (stats) => stats.totalQuestionsAnswered >= 500,
    category: "progress",
  },
  APOSTLE: {
    id: "apostle",
    title: "Apostle",
    description: "Answer 1000 questions",
    icon: "⚡",
    requirement: (stats) => stats.totalQuestionsAnswered >= 1000,
    category: "progress",
  },
  EVANGELIST: {
    id: "evangelist",
    title: "Evangelist",
    description: "Answer 2000 questions",
    icon: "🌠",
    requirement: (stats) => stats.totalQuestionsAnswered >= 2000,
    category: "progress",
  },

  // Accuracy milestones
  SHARP_MIND: {
    id: "sharp_mind",
    title: "Sharp Mind",
    description: "Answer 20 questions correctly in a row",
    icon: "🧠",
    requirement: (stats) => stats.currentStreak >= 20,
    category: "accuracy",
  },
  ACCURATE: {
    id: "accurate",
    title: "Accurate",
    description: "Maintain 80% accuracy with at least 30 questions answered",
    icon: "🎯",
    requirement: (stats) => {
      return (
        stats.totalQuestionsAnswered >= 30 &&
        stats.totalCorrect / stats.totalQuestionsAnswered >= 0.8
      );
    },
    category: "accuracy",
  },
  WISDOM_SEEKER: {
    id: "wisdom_seeker",
    title: "Wisdom Seeker",
    description: "Maintain 70% accuracy with at least 50 questions answered",
    icon: "🔍",
    requirement: (stats) => {
      return (
        stats.totalQuestionsAnswered >= 50 &&
        stats.totalCorrect / stats.totalQuestionsAnswered >= 0.7
      );
    },
    category: "accuracy",
  },
  DILIGENT_STUDENT: {
    id: "diligent_student",
    title: "Diligent Student",
    description: "Maintain 85% accuracy with at least 75 questions answered",
    icon: "📝",
    requirement: (stats) => {
      return (
        stats.totalQuestionsAnswered >= 75 &&
        stats.totalCorrect / stats.totalQuestionsAnswered >= 0.85
      );
    },
    category: "accuracy",
  },
  SCRIPTURE_EXPERT: {
    id: "scripture_expert",
    title: "Scripture Expert",
    description: "Maintain 90% accuracy with at least 100 questions answered",
    icon: "🏆",
    requirement: (stats) => {
      return (
        stats.totalQuestionsAnswered >= 100 &&
        stats.totalCorrect / stats.totalQuestionsAnswered >= 0.9
      );
    },
    category: "accuracy",
  },
  GOLDEN_MEMORY: {
    id: "golden_memory",
    title: "Golden Memory",
    description: "Answer 50 questions correctly in a row",
    icon: "✨",
    requirement: (stats) => stats.currentStreak >= 50,
    category: "accuracy",
  },
  FLAWLESS: {
    id: "flawless",
    title: "Flawless",
    description: "Maintain 95% accuracy with at least 200 questions answered",
    icon: "💎",
    requirement: (stats) => {
      return (
        stats.totalQuestionsAnswered >= 200 &&
        stats.totalCorrect / stats.totalQuestionsAnswered >= 0.95
      );
    },
    category: "accuracy",
  },

  // Perfect levels
  FIRST_PERFECT: {
    id: "first_perfect",
    title: "First Perfect",
    description: "Complete your first perfect level",
    icon: "🌟",
    requirement: (stats) => stats.perfectLevels >= 1,
    category: "perfect",
  },
  CONSISTENT: {
    id: "consistent",
    title: "Consistent",
    description: "Complete 3 perfect levels",
    icon: "⭐⭐⭐",
    requirement: (stats) => stats.perfectLevels >= 3,
    category: "perfect",
  },
  MASTER: {
    id: "master",
    title: "Master",
    description: "Complete 10 perfect levels",
    icon: "👑",
    requirement: (stats) => stats.perfectLevels >= 10,
    category: "perfect",
  },
  STEADFAST: {
    id: "steadfast",
    title: "Steadfast",
    description: "Complete 5 perfect levels",
    icon: "🔥",
    requirement: (stats) => stats.perfectLevels >= 5,
    category: "perfect",
  },
  FAITHFUL: {
    id: "faithful",
    title: "Faithful",
    description: "Complete 15 perfect levels",
    icon: "🌈",
    requirement: (stats) => stats.perfectLevels >= 15,
    category: "perfect",
  },
  PERFECT_TWENTY: {
    id: "perfect_twenty",
    title: "Perfect Twenty",
    description: "Complete 20 perfect levels",
    icon: "🏅",
    requirement: (stats) => stats.perfectLevels >= 20,
    category: "perfect",
  },
  SCRIPTURE_MASTER: {
    id: "scripture_master",
    title: "Scripture Master",
    description: "Complete 50 perfect levels",
    icon: "👑💫",
    requirement: (stats) => stats.perfectLevels >= 50,
    category: "perfect",
  },

  // Challenging achievements
  QUICK_LEARNER: {
    id: "quick_learner",
    title: "Quick Learner",
    description: "Complete 3 levels in one day",
    icon: "⚡",
    requirement: (stats) => stats.levelsCompletedToday >= 3,
    category: "challenge",
  },
  COMEBACK: {
    id: "comeback",
    title: "Comeback",
    description: "Win a level after previously failing it",
    icon: "🔄",
    requirement: (stats) => stats.hasComeback,
    category: "challenge",
  },
  DAILY_DEVOTION: {
    id: "daily_devotion",
    title: "Daily Devotion",
    description: "Play the game 7 days in a row",
    icon: "📅",
    requirement: (stats) => stats.consecutiveDays >= 7,
    category: "challenge",
  },
  MARATHON_READER: {
    id: "marathon_reader",
    title: "Marathon Reader",
    description: "Complete 5 levels in one day",
    icon: "🏃",
    requirement: (stats) => stats.levelsCompletedToday >= 5,
    category: "challenge",
  },
  SABBATH_KEEPER: {
    id: "sabbath_keeper",
    title: "Sabbath Keeper",
    description: "Play the game on 7 consecutive Sundays",
    icon: "🕊️📅",
    requirement: (stats) => stats.sundayStreak >= 7,
    category: "challenge",
  },
  PERSISTENT: {
    id: "persistent",
    title: "Persistent",
    description: "Win a level after failing it 3 times",
    icon: "🔨",
    requirement: (stats) => stats.hasOvercomeHardLevel,
    category: "challenge",
  },
  PERFECTIONIST: {
    id: "perfectionist",
    title: "Perfectionist",
    description: "Complete 3 perfect levels in a row",
    icon: "🌟🌟🌟",
    requirement: (stats) => stats.consecutivePerfectLevels >= 3,
    category: "challenge",
  },
};

// Wisdom titles based on win count
const WISDOM_TITLES = {
  0: "Novice",
  1: "Seeker of Truth",
  5: "Discerner of Spirits",
  10: "Steward of Knowledge",
  15: "Counselor of Wisdom",
  25: "Master of Parables",
  35: "Sage of Scripture",
  50: "Prophet of Insight",
  65: "Illuminated Elder",
  80: "Patriarch of Understanding",
  90: "Crown of Divine Wisdom",
  95: "Radiant Pillar of Faith",
  100: "Faithful Steward of Scripture",
};

const DEFAULT_STATS = {
  totalQuestionsAnswered: 0,
  totalCorrect: 0,
  currentStreak: 0,
  longestStreak: 0,
  perfectLevels: 0,
  levelsCompleted: 0,
  levelsCompletedToday: 0,
  lastPlayDate: null,
  hasComeback: false,
  failedLevelIds: [],
  unlockedAchievements: {},
  totalWins: 0,
  winProcessed: false,
};

class AchievementManager {
  constructor() {
    this.STORAGE_KEY = "bible_quiz_achievements_v1";
    this.stats = this.loadStats();
    this.newlyUnlocked = [];
  }

  loadStats() {
    try {
      const saved = localStorage.getItem(this.STORAGE_KEY);
      if (saved) {
        const stats = JSON.parse(saved);
        return { ...DEFAULT_STATS, ...stats };
      }
    } catch (e) {
      console.error("Failed to load achievements:", e);
    }
    return { ...DEFAULT_STATS };
  }

  saveStats() {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.stats));
    } catch (e) {
      console.error("Failed to save achievements:", e);
    }
  }

  // Reset newly unlocked achievements for next check
  resetNewlyUnlocked() {
    this.newlyUnlocked = [];
  }

  // Check current stats against all achievements
  checkAchievements() {
    this.resetNewlyUnlocked();

    // First, check if we need to reset daily stats
    this.checkDailyReset();

    // Check all achievements
    for (const key in ACHIEVEMENTS) {
      const achievement = ACHIEVEMENTS[key];

      // Skip if already unlocked
      if (this.stats.unlockedAchievements[achievement.id]) continue;

      // Check if requirement is met
      if (achievement.requirement(this.stats)) {
        this.stats.unlockedAchievements[achievement.id] = {
          unlockDate: new Date().toISOString(),
          achievement: achievement,
        };
        this.newlyUnlocked.push(achievement);
      }
    }

    this.saveStats();
    return this.newlyUnlocked;
  }

  // Check if we need to reset daily counters
  checkDailyReset() {
    const today = new Date().toDateString();
    if (this.stats.lastPlayDate !== today) {
      this.stats.lastPlayDate = today;
      this.stats.levelsCompletedToday = 0;
    }
  }

  // Update stats after answering a question
  updateQuestionStats(isCorrect, isLevelComplete, isLevelPerfect) {
    this.stats.totalQuestionsAnswered++;

    if (isCorrect) {
      this.stats.totalCorrect++;
      this.stats.currentStreak++;
      this.stats.longestStreak = Math.max(
        this.stats.longestStreak,
        this.stats.currentStreak
      );
    } else {
      this.stats.currentStreak = 0;
    }

    if (isLevelComplete) {
      this.stats.levelsCompleted++;
      this.stats.levelsCompletedToday++;

      if (isLevelPerfect) {
        this.stats.perfectLevels++;
      }
    }

    this.saveStats();
  }

  // Record a level attempt
  recordLevelAttempt(levelId, isSuccess) {
    if (!isSuccess && !this.stats.failedLevelIds.includes(levelId)) {
      this.stats.failedLevelIds.push(levelId);
    }

    if (isSuccess && this.stats.failedLevelIds.includes(levelId)) {
      this.stats.hasComeback = true;
    }

    this.saveStats();
  }

  // Get all unlocked achievements
  getUnlockedAchievements() {
    const unlocked = [];
    for (const id in this.stats.unlockedAchievements) {
      unlocked.push(this.stats.unlockedAchievements[id].achievement);
    }
    return unlocked;
  }

  // Get achievements by category
  getAchievementsByCategory(category) {
    return this.getUnlockedAchievements().filter(
      (a) => a.category === category
    );
  }

  // Get total achievement count and percentage
  getProgress() {
    const total = Object.keys(ACHIEVEMENTS).length;
    const unlocked = Object.keys(this.stats.unlockedAchievements).length;
    return {
      unlocked,
      total,
      percentage: total > 0 ? Math.round((unlocked / total) * 100) : 0,
    };
  }

  // Process a win and update win count
  processWin(isWin) {
    if (isWin && !this.stats.winProcessed) {
      this.stats.totalWins++;
      this.stats.winProcessed = true;
      this.saveStats();
    }
    return this.stats.totalWins;
  }

  resetWinProcessed() {
    this.stats.winProcessed = false;
    this.saveStats();
  }

  // Get wisdom title based on total wins
  getWisdomTitle() {
    const sortedWinThresholds = Object.keys(WISDOM_TITLES)
      .map(Number)
      .sort((a, b) => b - a);

    for (const threshold of sortedWinThresholds) {
      if (this.stats.totalWins >= threshold) {
        return WISDOM_TITLES[threshold];
      }
    }

    return "";
  }

  getTotalWins() {
    return this.stats.totalWins;
  }
}

const achievementManager = new AchievementManager();
