import { pool } from "../config/db.js";

const StudySession = {
  /**
   * Create a new study session
   */
  async create({
    userId,
    taskId,
    startTime,
    endTime,
    durationMinutes,
    title,
    focusTechnique,
    breakDuration,
    burnoutPrevention
  }) {
    const query = `
      INSERT INTO StudySessions (
        user_id,
        task_id,
        start_time,
        end_time,
        duration_minutes,
        title,
        focus_technique,
        break_duration,
        burnout_prevention
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const [result] = await pool.query(query, [
      userId,
      taskId || null,
      startTime,
      endTime,
      durationMinutes,
      title || null,
      focusTechnique || null,
      breakDuration || null,
      burnoutPrevention !== undefined ? (burnoutPrevention ? 1 : 0) : 1
    ]);
    return {
      sessionId: result.insertId
    };
  },

  /**
   * Get all study sessions for a user
   */
  async findAllByUser(userId) {
    const query = `
      SELECT 
        s.*,
        t.title AS task_title,
        t.status AS task_status
      FROM StudySessions s
      LEFT JOIN Tasks t ON s.task_id = t.task_id
      WHERE s.user_id = ?
      ORDER BY s.start_time DESC
    `;
    const [rows] = await pool.query(query, [userId]);
    return rows;
  },

  /**
   * Find study session by ID
   */
  async findById(sessionId) {
    const query = `
      SELECT * FROM StudySessions
      WHERE session_id = ?
    `;
    const [rows] = await pool.query(query, [sessionId]);
    if (rows.length === 0) return null;
    return rows[0];
  },

  /**
   * Delete study session
   */
  async delete(sessionId) {
    await pool.query("DELETE FROM StudySessions WHERE session_id = ?", [sessionId]);
  }
};

export default StudySession;
