const errorHandler = (err, req, res, next) => {
  // Log the error to the server console for debugging
  console.error(err.stack || err);

  // Set default status code to 500 if none is defined on the error
  const statusCode = err.statusCode || 500;
  
  // Set default response message
  const message = err.message || "An unexpected server error occurred.";

  res.status(statusCode).json({
    status: "ERROR",
    message: message,
    // Provide stack trace details only in development mode
    error: process.env.NODE_ENV === "development" ? err.stack : err.message,
  });
};

export default errorHandler;
