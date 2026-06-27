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
      modePreference: "Light"
    };
  },

  /**
   * Find a user by their unique user_id.
   * @param {number} id 
   * @returns {Promise<object|null>}
   */
  async findById(id) {
    const query = "SELECT user_id, full_name, email, age, gender, modePreference, created_at FROM Users WHERE user_id = ?";
    const [rows] = await pool.query(query, [id]);
    if (rows.length === 0) return null;
    return rows[0];
  }
};

export default User;
