import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

// JWT token for a user
const generateToken = (userId) => {
  const secret = process.env.JWT_SECRET || "mindful_study_jwt_secret_key_2026";
  const expiry = process.env.JWT_EXPIRES_IN || "24h";
  return jwt.sign({ userId }, secret, { expiresIn: expiry });
};

const authController = {
  // Register a new user
  async register(req, res) {
    try {
      const { name, email, password, age, gender } = req.body;

      // 1. Basic validation
      if (!name || !email || !password) {
        return res.status(400).json({
          status: "ERROR",
          message: "Please fill in all required fields (name, email, password)."
        });
      }

      const trimmedName = name.trim();
      const trimmedEmail = email.trim().toLowerCase();

      // 2. Email format validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(trimmedEmail)) {
        return res.status(400).json({
          status: "ERROR",
          message: "Please enter a valid email address."
        });
      }

      // 2b. Email domain validation
      const allowedDomains = ["gmail.com", "outlook.com", "student.cadt.edu.kh", "icloud.com", "yahoo.com"];
      const emailDomain = trimmedEmail.split("@")[1];
      if (!allowedDomains.includes(emailDomain)) {
        return res.status(400).json({
          status: "ERROR",
          message: "Please register with an approved email domain (gmail.com, outlook.com, student.cadt.edu.kh, icloud.com, or yahoo.com)."
        });
      }

      // 3. Password strength check (min 6 characters)
      if (password.length < 6) {
        return res.status(400).json({
          status: "ERROR",
          message: "Password must be at least 6 characters long."
        });
      }

      // 4. Age validation if provided
      let parsedAge = null;
      if (age !== undefined && age !== null && age !== "") {
        parsedAge = Number(age);
        if (!Number.isInteger(parsedAge) || parsedAge < 13 || parsedAge > 100) {
          return res.status(400).json({
            status: "ERROR",
            message: "Age must be an integer between 13 and 100."
          });
        }
      }

      // 5. Check if user already exists
      const existingUser = await User.findByEmail(trimmedEmail);
      if (existingUser) {
        return res.status(400).json({
          status: "ERROR",
          message: "An account with this email already exists."
        });
      }

      // 6. Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // 7. Save user in database
      const createdUser = await User.create({
        fullName: trimmedName,
        email: trimmedEmail,
        password: hashedPassword,
        age: parsedAge,
        gender: gender || null
      });

      // 8. Generate JWT token
      const token = generateToken(createdUser.userId);

      // 9. Send response
      return res.status(201).json({
        status: "SUCCESS",
        message: "Registration successful.",
        token,
        name: createdUser.fullName,
        email: createdUser.email,
        age: createdUser.age,
        gender: createdUser.gender,
        isNewUser: true
      });

    } catch (error) {
      console.error("Registration error:", error);
      return res.status(500).json({
        status: "ERROR",
        message: "An error occurred during registration. Please try again later.",
        error: error.message
      });
    }
  },


  // Log in an existing user
  async login(req, res) {
    try {
      const { email, password } = req.body;

      // 1. Basic validation
      if (!email || !password) {
        return res.status(400).json({
          status: "ERROR",
          message: "Please enter your email and password."
        });
      }

      const trimmedEmail = email.trim().toLowerCase();

      // 2. Find user in database
      const user = await User.findByEmail(trimmedEmail);
      if (!user) {
        return res.status(400).json({
          status: "ERROR",
          message: "No account found with this email. Please sign up first."
        });
      }

      // 3. Verify password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(400).json({
          status: "ERROR",
          message: "Incorrect password. Please try again."
        });
      }

      // 4. Generate JWT token
      const token = generateToken(user.user_id);

      // Calculate streak dynamically
      const streak = await User.getStreak(user.user_id);

      // 5. Send response matching frontend structure
      return res.status(200).json({
        status: "SUCCESS",
        message: "Login successful.",
        token,
        name: user.full_name,
        email: user.email,
        age: user.age,
        gender: user.gender,
        isNewUser: user.isNewUser === 1 || user.isNewUser === true || user.isNewUser === '1',
        streak
      });

    } catch (error) {
      console.error("Login error:", error);
      return res.status(500).json({
        status: "ERROR",
        message: "An error occurred during login. Please try again later.",
        error: error.message
      });
    }
  },

  // Mark the onboarding guide as completed/seen
  async completeGuide(req, res) {
    try {
      const userId = req.user.userId;
      if (!userId) {
        return res.status(400).json({
          status: "ERROR",
          message: "User ID not found in request."
        });
      }

      await User.completeGuide(userId);

      return res.status(200).json({
        status: "SUCCESS",
        message: "Onboarding guide completed successfully."
      });
    } catch (error) {
      console.error("Complete guide error:", error);
      return res.status(500).json({
        status: "ERROR",
        message: "An error occurred while updating the guide completion status.",
        error: error.message
      });
    }
  },

  // Get user's current streak dynamically
  async getStreak(req, res) {
    try {
      const userId = req.user.userId;
      if (!userId) {
        return res.status(400).json({
          status: "ERROR",
          message: "User ID not found in request."
        });
      }

      const streak = await User.getStreak(userId);

      return res.status(200).json({
        status: "SUCCESS",
        streak
      });
    } catch (error) {
      console.error("Get streak error:", error);
      return res.status(500).json({
        status: "ERROR",
        message: "An error occurred while fetching user streak.",
        error: error.message
      });
    }
  }
};

export default authController;
