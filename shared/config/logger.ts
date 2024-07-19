import { createLogger, format, transports } from "winston";

const customFormat = format.printf(
  ({ level, message, moduleName, functionName }) => {
    return `[${moduleName}/${functionName}] ${level}: ${message}`;
  }
);

const isDevelopmentORTest =
  process.env.NODE_ENV === "development" || process.env.NODE_ENV === "test";

const _logger = createLogger({
  level: isDevelopmentORTest ? "debug" : "info",
  format: format.combine(
    format.colorize(),
    format.splat(),
    format.json(),
    format.timestamp(),
    format.ms(),
    customFormat
  ),
  transports: [new transports.Console({})],
});

const logger = function (moduleName: string) {
  return (functionName: string) => _logger.child({ moduleName, functionName });
};

// Add a stream function to use with morgan
logger.stream = {
  write: (message: string) => {
    logger("morgan")("").info(message.trim());
  },
};

export default logger;
