const { createLogger, format, transports } = require("winston");
const { combine, timestamp, printf, colorize } = format;

const myFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} [${level}]: ${message}`;
});

const logger = createLogger({
  level: "info",
  format: combine(timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), myFormat),
  transports: [
    new transports.Console({
      format: combine(colorize(), myFormat),
    }),
    new transports.File({ filename: "./logger/success.log", level: "info" }),
    new transports.File({ filename: "./logger/error.log", level: "error" }),
  ],
});

module.exports = logger;
