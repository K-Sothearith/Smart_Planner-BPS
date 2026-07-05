import BurnoutLog from "../models/BurnoutLog.js";
import Task from "../models/Task.js";
import StudySession from "../models/StudySession.js";
import User from "../models/User.js";

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
        // If no log is made, set the index to 0
        scores = {
          moodScore: 0,
          sleepScore: 0,
          sleepQualityScore: 0,
          screenTimeScore: 0,
          pendingScore: 0,
          overdueScore: 0,
          missedScore: 0,
          burnoutIndex: 0
        };
        liveIndex = 0;
      }

      // 5. Generate Weekly Productivity & Workload Stats from real data
      const user = await User.findById(userId);
      const createdDateVal = user ? (user.created_at || new Date()) : new Date();
      const T0 = new Date(createdDateVal);
      T0.setHours(0, 0, 0, 0);

      const weeks = [];
      let weekIndex = 1;
      let weekStart = new Date(T0);
      const now = new Date();

      // Loop to generate weekly ranges up to current time
      while (weekStart <= now || weeks.length === 0) {
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekEnd.getDate() + 7);

        weeks.push({
          weekNum: weekIndex,
          start: new Date(weekStart),
          end: new Date(weekEnd),
          sessions: [],
          completedTasks: []
        });

        weekStart = new Date(weekEnd);
        weekIndex++;
      }

      // Distribute sessions and completed tasks to weeks
      const allTasks = await Task.findAllByUser(userId);

      for (const session of sessions) {
        const sessionDate = new Date(session.start_time);
        for (const week of weeks) {
          if (sessionDate >= week.start && sessionDate < week.end) {
            week.sessions.push(session);
            break;
          }
        }
      }

      for (const task of allTasks) {
        if (task.status === "Done" && task.completed_at) {
          const completedDate = new Date(task.completed_at);
          for (const week of weeks) {
            if (completedDate >= week.start && completedDate < week.end) {
              week.completedTasks.push(task);
              break;
            }
          }
        }
      }

      const formatShortDate = (d) => {
        const actualMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        return `${actualMonths[d.getMonth()]} ${String(d.getDate()).padStart(2, "0")}`;
      };

      const weeklyProductivity = weeks.map((week) => {
        const completedSessions = week.sessions.filter((s) => s.is_completed === 1);
        const totalMinutes = completedSessions.reduce((sum, s) => sum + (s.duration_minutes || 0), 0);
        const studyHrs = Math.round((totalMinutes / 60) * 10) / 10;

        // Dynamic focus calculation
        let baseFocus = 80;
        if (week.completedTasks.length > 0) {
          baseFocus += Math.min(week.completedTasks.length * 3, 15);
        }
        const failedSessions = week.sessions.filter((s) => s.is_completed === 0).length;
        if (failedSessions > 0) {
          baseFocus -= Math.min(failedSessions * 5, 15);
        }
        const avgFocus = Math.max(50, Math.min(100, baseFocus));

        // Find burnout log entries in this week range
        const weeklyLogs = history.filter((log) => {
          const logDate = new Date(log.created_at);
          return logDate >= week.start && logDate < week.end;
        });

        let burnoutIndex = 0;
        if (weeklyLogs.length > 0) {
          const sum = weeklyLogs.reduce((acc, l) => acc + l.burnout_index, 0);
          burnoutIndex = Math.round(sum / weeklyLogs.length);
        } else {
          // Estimate base risk index on user workloads if no logs exist
          const liveWorkload = (week.sessions.length * 5) + (week.completedTasks.length * 2);
          burnoutIndex = Math.min(45, liveWorkload);
        }

        let status = "Healthy";
        if (burnoutIndex > 75) status = "Severe Burnout";
        else if (burnoutIndex > 50) status = "High Fatigue";
        else if (burnoutIndex > 25) status = "Mild Fatigue";

        return {
          week: `Week ${week.weekNum} (${formatShortDate(week.start)} - ${formatShortDate(new Date(week.end.getTime() - 1000))})`,
          studyHours: studyHrs,
          breaks: completedSessions.length,
          focus: avgFocus,
          status
        };
      }).reverse(); // Show latest week first

      // 6. Generate Study Distribution & Balance Stats from real data
      const categoryMinutes = {
        Practice: 0,
        Assignment: 0,
        Project: 0,
        Revision: 0,
        Research: 0,
        Others: 0
      };

      let totalMinutesAll = 0;

      for (const session of sessions) {
        if (session.is_completed === 1) {
          const cat = session.category_name || "Others";
          categoryMinutes[cat] = (categoryMinutes[cat] || 0) + (session.duration_minutes || 0);
          totalMinutesAll += (session.duration_minutes || 0);
        }
      }

      const categoryDistribution = Object.keys(categoryMinutes).map((catName) => {
        const mins = categoryMinutes[catName];
        const pct = totalMinutesAll > 0 ? Math.round((mins / totalMinutesAll) * 100) : 0;
        return {
          category: catName,
          percentage: pct,
          hours: Math.round((mins / 60) * 10) / 10
        };
      });

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
        },
        weeklyProductivity,
        categoryDistribution
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
