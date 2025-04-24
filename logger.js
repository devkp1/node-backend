import { createLogger, format, transports } from 'winston';
import config from './config/loggerConfig/config.js';

const logger = createLogger({
  level: config.logLevel,
  format: format.combine(
    format.colorize(),
    format.timestamp(),
    format.printf(({ timestamp, level, message }) => {
      return `${timestamp} ${level}: ${message} `;
    }),
  ),
  transports: [
    new transports.Console(),
    new transports.File({ filename: `logs/${config.env}.log` }),
  ],
});

export default logger;
