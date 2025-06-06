import winston from "winston";
import config from "@/config";

const transports = [];

if (config.env === "test") {
  // No transports in test to prevent any logging
} else {
  transports.push(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        winston.format.colorize(),
        winston.format.printf(({ level, message, timestamp }) => {
          return `[${timestamp}] ${level}: ${message}`;
        })
      ),
    })
  );
}

const loggerInstance = winston.createLogger({
  level: config.logs?.level || "info",
  levels: winston.config.npm.levels,
  transports,
});

export default loggerInstance;
