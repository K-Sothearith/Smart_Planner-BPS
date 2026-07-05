import API from "./api.js";

const analyticsService = {
  /**
   * Fetch current burnout index, task counts, and historic logs.
   * @returns {Promise<object>}
   */
  async getAnalytics() {
    const response = await API.get("/analytics");
    return response.data;
  },

  /**
   * Save a new burnout log check-in entry.
   * @param {object} logData
   * @param {string} logData.moodLevel
   * @param {string} logData.sleepHours
   * @param {number} logData.sleepQuality
   * @param {string} logData.screenTime
   * @param {string} [logData.note]
   * @returns {Promise<object>}
   */
  async createBurnoutLog(logData) {
    const response = await API.post("/analytics/burnout-log", logData);
    return response.data;
  }
};

export default analyticsService;
