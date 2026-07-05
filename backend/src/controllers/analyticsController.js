import BurnoutLog from "../models/BurnoutLog.js";
import Task from "../models/Task.js";
import StudySession from "../models/StudySession.js";

// Helper helper functions for date checking
const isDatePastToday = (dateStr) => {
  if (!dateStr) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const date = new Date(dateStr);
  date.setHours(0, 0, 0, 0);
  return date < today;
};

// Helper helper to calculate scores
const calculateRiskScores = ({
  moodLevel,
  sleepHours,
  sleepQuality,
  screenTime,
  pendingCount,
  overdueCount,
  missedCount
}) => {
  // 1. Mood Score (30%): logs 1 to 5 (e.g. 4 -> Score 80)
  const moodMap = {
    'Happy': 20,
    'Normal': 40,
    'Tired': 60,
    'Frustrated': 80,
    'Stressed': 100
  };
  const moodScore = moodMap[moodLevel] || 60; // default Normal-Tired

  // 2. Sleep Score (10%): 'Under 4 hours' (100), '5-6 hours' (75), '7-8 hours' (25), 'Above 8 hours' (50)
  const sleepMap = {
    'Under 4 hours': 100,
    '5-6 hours': 75,
    '7-8 hours': 25,
    'Above 8 hours': 50
  };
  const sleepScore = sleepMap[sleepHours] || 25;

  // 3. Sleep Quality (10%): 1 (Terrible) -> 100 risk, 5 (Excellent) -> 20 risk
  const qualityMap = {
    1: 100,
    2: 80,
    3: 60,
    4: 40,
    5: 20
  };
  const sleepQualityScore = qualityMap[Number(sleepQuality)] || 60;

  // 4. Screen Time (10%): Under 4 hours (25), 5-6 hours (50), 7-8 hours (75), Above 8 hours (100)
  const screenMap = {
    'Under 4 hours': 25,
    '5-6 hours': 50,
    '7-8 hours': 75,
    'Above 8 hours': 100
  };
  const screenTimeScore = screenMap[screenTime] || 50;

  // 5. Pending Tasks (20%): 0 -> 0, 1-2 -> 30, 3-4 -> 65, 5+ -> 100
  let pendingScore = 0;
  if (pendingCount >= 5) pendingScore = 100;
  else if (pendingCount >= 3) pendingScore = 65;
  else if (pendingCount >= 1) pendingScore = 30;

  // 6. Overdue Tasks (10%): 0 -> 0, 1 -> 50, 2+ -> 100
  let overdueScore = 0;
  if (overdueCount >= 2) overdueScore = 100;
  else if (overdueCount === 1) overdueScore = 50;

  // 7. Missed Study Sessions (10%): 0 -> 0, 1 -> 50, 2+ -> 100
  let missedScore = 0;
  if (missedCount >= 2) missedScore = 100;
  else if (missedCount === 1) missedScore = 50;

  // Compute final index
  const indexValue = Math.round(
    moodScore * 0.3 +
    sleepScore * 0.1 +
    sleepQualityScore * 0.1 +
    screenTimeScore * 0.1 +
    pendingScore * 0.2 +
    overdueScore * 0.1 +
    missedScore * 0.1
  );

  return {
    moodScore,
    sleepScore,
    sleepQualityScore,
    screenTimeScore,
    pendingScore,
    overdueScore,
    missedScore,
    burnoutIndex: indexValue
  };
};

const analyticsController = {
  /**
   * Log a new Burnout check-in and calculate burnout risk.
   */
  async logBurnout(req, res) {
    try {
      const userId = req.user.userId;
      const { moodLevel, sleepHours, sleepQuality, screenTime, note } = req.body;

      if (!moodLevel || !sleepHours || !sleepQuality || !screenTime) {
        return res.status(400).json({
          status: "ERROR",
          message: "Mood, sleep hours, sleep quality, and screen time are required.",
        });
      }

      // Fetch system/database workload indicators
      const tasks = await Task.findAllByUser(userId);
      const pendingCount = tasks.filter(t => t.status === 'Undone').length;
      const overdueCount = tasks.filter(t => t.status === 'Undone' && isDatePastToday(t.due_date)).length;

      const sessions = await StudySession.findAllByUser(userId);
      const missedCount = sessions.filter(
        s => new Date(s.start_time) < new Date() && s.is_completed === 0
      ).length;

      // Calculate the index using helper
      const scores = calculateRiskScores({
        moodLevel,
        sleepHours,
        sleepQuality,
        screenTime,
        pendingCount,
        overdueCount,
        missedCount
      });

      // Save into DB
      const result = await BurnoutLog.create({
        userId,
        moodLevel,
        sleepHours,
        sleepQuality,
        screenTime,
        note,
        burnoutIndex: scores.burnoutIndex,
      });

      return res.status(201).json({
        status: "SUCCESS",
        message: "Burnout log saved and index calculated successfully.",
        burnoutId: result.burnoutId,
        burnoutIndex: scores.burnoutIndex,
        scores
      });

    } catch (error) {
      console.error("Failed to log burnout check-in:", error);
      return res.status(500).json({
        status: "ERROR",
        message: "Failed to save burnout check-in.",
        error: error.message,
      });
    }
  },

  /**
   * Fetch current burnout index, task workload states, and check-in history.
   */
  async getAnalytics(req, res) {
    try {
      const userId = req.user.userId;

      // 1. Fetch task workload indicators
      const tasks = await Task.findAllByUser(userId);
      const pendingCount = tasks.filter(t => t.status === 'Undone').length;
      const overdueCount = tasks.filter(t => t.status === 'Undone' && isDatePastToday(t.due_date)).length;

      // 2. Fetch session workload indicators
      const sessions = await StudySession.findAllByUser(userId);
      const missedCount = sessions.filter(
        s => new Date(s.start_time) < new Date() && s.is_completed === 0
      ).length;

      // 3. Fetch check-in history
      const history = await BurnoutLog.findAllByUser(userId);
      const latestLog = await BurnoutLog.findLatestByUser(userId);

      // 4. Calculate live index
      let liveIndex = 0;
      let scores = null;

      if (latestLog) {
        scores = calculateRiskScores({
          moodLevel: latestLog.mood_level,
          sleepHours: latestLog.sleep_hours,
          sleepQuality: latestLog.sleep_quality,
          screenTime: latestLog.screen_time,
          pendingCount,
          overdueCount,
          missedCount
        });
        liveIndex = scores.burnoutIndex;
      } else {
        // Fallback baseline if no logs submitted yet
        scores = calculateRiskScores({
          moodLevel: 'Normal',
          sleepHours: '7-8 hours',
          sleepQuality: 4,
          screenTime: '5-6 hours',
          pendingCount,
          overdueCount,
          missedCount
        });
        liveIndex = scores.burnoutIndex;
      }

      return res.status(200).json({
        status: "SUCCESS",
        latestLog,
        history,
        liveIndex,
        liveScores: scores,
        taskMetrics: {
          pendingCount,
          overdueCount,
          missedCount
        }
      });

    } catch (error) {
      console.error("Failed to fetch analytics:", error);
      return res.status(500).json({
        status: "ERROR",
        message: "Failed to load analytics data.",
        error: error.message,
      });
    }
  }
};

export default analyticsController;
