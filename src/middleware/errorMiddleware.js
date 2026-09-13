const multer = require("multer");

const errorHandler = (err, req, res, next) => {
  console.error("DEBUG ERROR:", err); // Logs full trace to your terminal

  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({ message: "File size exceeds strict 3MB max size limit." });
    }
    return res.status(400).json({ message: err.message });
  }

  const statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;
  return res.status(statusCode).json({
    message: err.message || "Internal Server Error",
    error: process.env.NODE_ENV === "production" ? {} : err
  });
};

module.exports = errorHandler;