const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");
const multer = require("multer");

const app = express();

app.use(express.json());
app.use(cors());





module.exports = app;