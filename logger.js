const { createLogger, format, transports } = require("winston");
const path = require("path");

const logDir = path.join(__dirname, "logs");

// Logger config
const logger = createLogger({
  level: "info",
  format: format.combine(
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    format.printf(
      info => `${info.timestamp} [${info.level.toUpperCase()}]: ${info.message}`
    )
  ),
  transports: [
    // Log info and above to file
    new transports.File({ filename: path.join(logDir, "combined.log") }),
    // Log errors separately
    new transports.File({ filename: path.join(logDir, "error.log"), level: "error" }),
  ],
});

// If not production, also log to console with color
if (process.env.NODE_ENV !== "production") {
  logger.add(new transports.Console({
    format: format.combine(format.colorize(), format.simple()),
  }));
}

module.exports = logger;