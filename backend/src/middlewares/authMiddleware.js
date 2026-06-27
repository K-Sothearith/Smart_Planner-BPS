import jwt from "jsonwebtoken";


// Authentication Middleware
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  
  if (!authHeader) {
    return res.status(401).json({
      status: "ERROR",
      message: "Access Denied. No authorization token provided."
    });
  }

  // Header format: Bearer <token>
  const parts = authHeader.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") {
    return res.status(401).json({
      status: "ERROR",
      message: "Token format error. Expected 'Bearer <token>'."
    });
  }

  const token = parts[1];

  try {
    const JWT_SECRET = process.env.JWT_SECRET || "mindful_study_jwt_secret_key_2026";
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Attach decoded user info (typically contains userId) to the request object
    req.user = decoded;
    
    next();
  } catch (error) {
    return res.status(401).json({
      status: "ERROR",
      message: "Invalid or expired authorization token.",
      error: error.message
    });
  }
};

export default authMiddleware;
