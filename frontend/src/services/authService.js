import API from "./api.js";

const authService = {
  /**
   * Log in an existing user.
   * @param {string} email 
   * @param {string} password 
   * @returns {Promise<object>} The authentication response data (user details + JWT token)
   */
  async login(email, password) {
    const response = await API.post("/auth/login", { email, password });
    return response.data;
  },

  /**
   * Register a new user account.
   * @param {object} registrationData
   * @param {string} registrationData.name
   * @param {string} registrationData.email
   * @param {number|string} registrationData.age
   * @param {string} registrationData.gender
   * @param {string} registrationData.password
   * @returns {Promise<object>} The authentication response data (user details + JWT token)
   */
  async register({ name, email, age, gender, password }) {
    const response = await API.post("/auth/register", {
      name,
      email,
      age: age ? Number(age) : null,
      gender: gender || null,
      password,
    });
    return response.data;
  },
};

export default authService;
