const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 2020;

const logger = require("./logger");

app.use((req, res, next) => {
  const origin = req.headers.origin || "unknown origin";
  const ip = req.ip || req.socket.remoteAddress || "unknown IP";
  const now = new Date().toISOString();
  const logMessage = `${req.method} ${req.originalUrl} - From: ${origin} - IP: ${ip}`;

  logger.info(logMessage);
  next();
});

// Middleware:
app.use(cors({ origin: "*" })); 
app.use(express.json());

// API Routes:
app.use("/api/notify", require("./routes/emailConfirmationRoutes"));


// Adding "Help World" to base URL to confrim backend is working
app.get("/", (req, res) => {
  res.send("Calvin's Microservice is Running");
});

const os = require("os");
const hostname = os.hostname();

app.listen(PORT, () => {
  // flip server should automatically match whatever server you're on 
  console.log(`Server running:  ${hostname}:${PORT}...`);
});
