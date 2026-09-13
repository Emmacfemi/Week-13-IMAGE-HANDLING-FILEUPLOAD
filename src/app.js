const express = require("express");
const cors = require("cors");
const path = require("path");

const userRoutes = require("./routes/userRoute");
const articleRoutes = require("./routes/articleRoute");

const errorHandler = require("./middleware/errorMiddleware");
const logHandler = require("./middleware/loggerMiddleware");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Added for multipart form parsing
app.use(cors());

app.use(logHandler);

app.use("/api/user", userRoutes);
app.use("/api", articleRoutes);

// Global Error Middleware handles Multer errors
app.use(errorHandler);

module.exports = app;