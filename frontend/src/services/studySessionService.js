import API from "./api.js";

const studySessionService = {
  /**
   * Get all study sessions for the authenticated user.
   * @returns {Promise<Array>}
   */
  async getSessions() {
    const response = await API.get("/study-sessions");
    return response.data.sessions;
  },

  /**
   * Create a new study session.
   * @param {object} sessionData
   * @param {number} [sessionData.taskId]
   * @param {string} sessionData.title
   * @param {string} sessionData.startTime - ISO or custom datetime string
   * @param {number} sessionData.durationMinutes
   * @param {string} [sessionData.focusTechnique]
   * @param {string} [sessionData.breakDuration]
   * @param {boolean} [sessionData.burnoutPrevention]
   * @returns {Promise<object>}
   */
  async createSession(sessionData) {
    const response = await API.post("/study-sessions", sessionData);
    return response.data.session;
  },

  /**
   * Delete a study session by ID.
   * @param {number|string} id
   * @returns {Promise<object>}
   */
  async deleteSession(id) {
    const response = await API.delete(`/study-sessions/${id}`);
    return response.data;
  }
};

export default studySessionService;
