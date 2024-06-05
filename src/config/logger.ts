import { createLogger, format, transports } from "winston";

const customFormat = format.printf(
  ({ level, message, moduleName, functionName, service }) => {
    return `${
      process.env.NODE_ENV === "production" && service
    } [${moduleName}/${functionName}] ${level}: ${message}`;
  }
);

const _logger = createLogger({
  level: process.env.NODE_ENV === "development" ? "debug" : "info",
  defaultMeta: { service: process.env.APP_NAME },
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
