import { pool } from "../config/db.js";

const User = {
  /**
   * Find a user by their email address.
   * @param {string} email 
   * @returns {Promise<object|null>}
   */
  async findByEmail(email) {
    const query = "SELECT * FROM Users WHERE email = ?";
    const [rows] = await pool.query(query, [email.toLowerCase().trim()]);
    if (rows.length === 0) return null;
    return rows[0];
  },

  /**
   * Create a new user in the database.
   * @param {object} userData 
   * @param {string} userData.fullName
   * @param {string} userData.email
   * @param {string} userData.password (already hashed)
   * @param {number} userData.age
   * @param {string} userData.gender
   * @returns {Promise<object>} The created user metadata (excluding password)
   */
  async create({ fullName, email, password, age, gender }) {
    const query = `
      INSERT INTO Users (full_name, email, password, age, gender, created_at, modePreference)
      VALUES (?, ?, ?, ?, ?, CURDATE(), 'Light')
    `;
    const params = [
      fullName.trim(),
      email.toLowerCase().trim(),
      password,
      age || null,
      gender || null
    ];

    const [result] = await pool.query(query, params);
    
    return {
      userId: result.insertId,
      fullName,
      email,
      age,
      gender,
      isNewUser: true,
      modePreference: "Light"
    };
  },

  /**
   * Find a user by their unique user_id.
   * @param {number} id 
   * @returns {Promise<object|null>}
   */
  async findById(id) {
    const query = "SELECT user_id, full_name, email, age, gender, modePreference, isNewUser, created_at FROM Users WHERE user_id = ?";
    const [rows] = await pool.query(query, [id]);
    if (rows.length === 0) return null;
    return rows[0];
  },

  /**
   * Mark the onboarding guide as completed/seen.
   * @param {number} userId
   * @returns {Promise<void>}
   */
  async completeGuide(userId) {
    const query = "UPDATE Users SET isNewUser = FALSE WHERE user_id = ?";
    await pool.query(query, [userId]);
  },

  /**
   * Calculate daily study/task streak dynamically.
   * @param {number} userId
   * @returns {Promise<number>} Current streak count
   */
  async getStreak(userId) {
    const query = `
      SELECT DISTINCT study_date FROM (
        SELECT DATE(completed_at) AS study_date FROM Tasks WHERE user_id = ? AND status = 'Done' AND completed_at IS NOT NULL
        UNION
        SELECT DATE(start_time) AS study_date FROM StudySessions WHERE user_id = ? AND start_time IS NOT NULL
      ) AS combined_dates
      ORDER BY study_date DESC
    `;

    const [rows] = await pool.query(query, [userId, userId]);
    
    if (rows.length === 0) return 0;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);

    const formatDate = (date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    const todayStr = formatDate(today);
    const yesterdayStr = formatDate(yesterday);

    const studyDates = rows.map(r => {
      const dateObj = new Date(r.study_date);
      return formatDate(dateObj);
    });

    if (!studyDates.includes(todayStr) && !studyDates.includes(yesterdayStr)) {
      return 0;
    }

    let streak = 0;
    let currentDateToCheck = studyDates.includes(todayStr) ? today : yesterday;

    while (true) {
      const dateStr = formatDate(currentDateToCheck);
      if (studyDates.includes(dateStr)) {
        streak++;
        currentDateToCheck.setDate(currentDateToCheck.getDate() - 1);
      } else {
        break;
      }
    }

    return streak;
  }
};

export default User;
