import BurnoutLog from "../models/BurnoutLog.js";
import Task from "../models/Task.js";
import StudySession from "../models/StudySession.js";
import User from "../models/User.js";

const isDatePastToday = (dateStr) => {
  if (!dateStr) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const date = new Date(dateStr);
  date.setHours(0, 0, 0, 0);
  return date < today;
};

const calculateRiskScores = ({
  moodLevel,
  sleepHours,
  sleepQuality,
  screenTime,
  pendingCount,
  overdueCount,
  missedCount
}) => {
  const moodMap = {
    'Happy': 20,
    'Normal': 40,
    'Tired': 60,
    'Frustrated': 80,
    'Stressed': 100
  };
  const moodScore = moodMap[moodLevel] || 60;

  const sleepMap = {
    'Under 4 hours': 100,
    '5-6 hours': 75,
    '7-8 hours': 25,
    'Above 8 hours': 50
  };
  const sleepScore = sleepMap[sleepHours] || 25;

  const qualityMap = {
    1: 100,
    2: 80,
    3: 60,
    4: 40,
    5: 20
  };
  const sleepQualityScore = qualityMap[Number(sleepQuality)] || 60;

  const screenMap = {
    'Under 4 hours': 25,
    '5-6 hours': 50,
    '7-8 hours': 75,
    'Above 8 hours': 100
  };
  const screenTimeScore = screenMap[screenTime] || 50;

  let pendingScore = 0;
  if (pendingCount >= 5) pendingScore = 100;
  else if (pendingCount >= 3) pendingScore = 65;
  else if (pendingCount >= 1) pendingScore = 30;

  let overdueScore = 0;
  if (overdueCount >= 2) overdueScore = 100;
  else if (overdueCount === 1) overdueScore = 50;

  let missedScore = 0;
  if (missedCount >= 2) missedScore = 100;
  else if (missedCount === 1) missedScore = 50;

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

const getBurnoutRecommendationAndRisk = (idx) => {
  let riskDetails = {};
  let recommendation = {};

  if (idx >= 76) {
    riskDetails = {
      label: 'High Burnout Risk',
      colorClass: 'text-rose-500 dark:text-rose-455',
      borderClass: 'border-rose-500/20 text-rose-600 dark:text-rose-400 bg-rose-500/10',
      circleColor: 'stroke-rose-500'
    };
    recommendation = {
      title: "Critical Overload",
      text: "Your burnout risk is critical! Reschedule non-urgent tasks and take an extended recovery break.",
      boxClass: "bg-rose-500/5 dark:bg-rose-500/10 border-rose-500/20 text-rose-700 dark:text-rose-300",
      titleClass: "text-rose-800 dark:text-rose-400",
      actionText: "Take deep breaths ⏱️",
      actionType: "breathing"
    };
  } else if (idx >= 41) {
    riskDetails = {
      label: 'Moderate Fatigue',
      colorClass: 'text-amber-500 dark:text-amber-455',
      borderClass: 'border-amber-500/20 text-amber-600 dark:text-amber-400 bg-amber-500/10',
      circleColor: 'stroke-amber-500'
    };
    recommendation = {
      title: "Moderate Fatigue",
      text: "Study intensity is high. Take shorter 5-min stretch breaks every 25 minutes to avoid fatigue.",
      boxClass: "bg-amber-500/5 dark:bg-amber-500/10 border-amber-500/20 text-amber-700 dark:text-amber-300",
      titleClass: "text-amber-850 dark:text-amber-400",
      actionText: "Breathing exercise ⏱️",
      actionType: "breathing"
    };
  } else {
    riskDetails = {
      label: 'Healthy Balance',
      colorClass: 'text-emerald-600 dark:text-emerald-455',
      borderClass: 'border-emerald-500/20 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10',
      circleColor: 'stroke-emerald-500'
    };
    recommendation = {
      title: "Optimal Balance",
      text: "Workload and lifestyle are well balanced. Maintain your schedule and take standard scheduled breaks.",
      boxClass: "bg-emerald-500/5 dark:bg-emerald-500/10 border-emerald-500/20 text-emerald-700 dark:text-emerald-300",
      titleClass: "text-emerald-800 dark:text-emerald-400",
      actionText: "View study planner 📅",
      actionType: "planner"
    };
  }

  return { riskDetails, recommendation };
};

const analyticsController = {
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

      const tasks = await Task.findAllByUser(userId);
      const pendingCount = tasks.filter(t => t.status === 'Undone').length;
      const overdueCount = tasks.filter(t => t.status === 'Undone' && isDatePastToday(t.due_date)).length;

      const sessions = await StudySession.findAllByUser(userId);
      const missedCount = sessions.filter(
        s => new Date(s.start_time) < new Date() && s.is_completed === 0
      ).length;

      const scores = calculateRiskScores({
        moodLevel,
        sleepHours,
        sleepQuality,
        screenTime,
        pendingCount,
        overdueCount,
        missedCount
      });

      const { riskDetails, recommendation } = getBurnoutRecommendationAndRisk(scores.burnoutIndex);

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
        scores,
        riskDetails,
        recommendation
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

  async getAnalytics(req, res) {
    try {
      const userId = req.user.userId;

      const tasks = await Task.findAllByUser(userId);
      const pendingCount = tasks.filter(t => t.status === 'Undone').length;
      const overdueCount = tasks.filter(t => t.status === 'Undone' && isDatePastToday(t.due_date)).length;

      const sessions = await StudySession.findAllByUser(userId);
      const missedCount = sessions.filter(
        s => new Date(s.start_time) < new Date() && s.is_completed === 0
      ).length;

      const history = await BurnoutLog.findAllByUser(userId);
      const latestLog = await BurnoutLog.findLatestByUser(userId);

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

      const { riskDetails, recommendation } = getBurnoutRecommendationAndRisk(liveIndex);

      const user = await User.findById(userId);
      const createdDateVal = user ? (user.created_at || new Date()) : new Date();
      const T0 = new Date(createdDateVal);
      T0.setHours(0, 0, 0, 0);

      const weeks = [];
      let weekIndex = 1;
      let weekStart = new Date(T0);
      const now = new Date();

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

        let baseFocus = 80;
        if (week.completedTasks.length > 0) {
          baseFocus += Math.min(week.completedTasks.length * 3, 15);
        }
        const failedSessions = week.sessions.filter((s) => s.is_completed === 0).length;
        if (failedSessions > 0) {
          baseFocus -= Math.min(failedSessions * 5, 15);
        }
        const avgFocus = Math.max(50, Math.min(100, baseFocus));

        const weeklyLogs = history.filter((log) => {
          const logDate = new Date(log.created_at);
          return logDate >= week.start && logDate < week.end;
        });

        let burnoutIndex = 0;
        if (weeklyLogs.length > 0) {
          const sum = weeklyLogs.reduce((acc, l) => acc + l.burnout_index, 0);
          burnoutIndex = Math.round(sum / weeklyLogs.length);
        } else {
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
      }).reverse();

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
        riskDetails,
        recommendation,
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
