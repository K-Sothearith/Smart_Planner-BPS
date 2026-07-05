import { pool } from "../config/db.js";

const BurnoutLog = {
  /**
   * Create a new burnout log entry
   */
  async create({
    userId,
    moodLevel,
    sleepHours,
    sleepQuality,
    screenTime,
    note,
    burnoutIndex
  }) {
    const query = `
      INSERT INTO BurnoutLogs (
        user_id,
        mood_level,
        sleep_hours,
        sleep_quality,
        screen_time,
        note,
        burnout_index,
        created_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, CURDATE())
    `;

    const [result] = await pool.query(query, [
      userId,
      moodLevel,
      sleepHours,
      sleepQuality,
      screenTime,
      note || null,
      burnoutIndex,
    ]);

    return {
      burnoutId: result.insertId,
    };
  },

  /**
   * Get all burnout logs for a specific user
   */
  async findAllByUser(userId) {
    const query = `
      SELECT * FROM BurnoutLogs
      WHERE user_id = ?
      ORDER BY created_at DESC, burnout_id DESC
    `;
    const [rows] = await pool.query(query, [userId]);
    return rows;
  },

  /**
   * Get the most recent burnout log for a user
   */
  async findLatestByUser(userId) {
    const query = `
      SELECT * FROM BurnoutLogs
      WHERE user_id = ?
      ORDER BY created_at DESC, burnout_id DESC
      LIMIT 1
    `;
    const [rows] = await pool.query(query, [userId]);
    if (rows.length === 0) return null;
    return rows[0];
  }
};

export default BurnoutLog;
