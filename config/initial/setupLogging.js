import winston from 'winston';

export const setupLogging = (logger) => {
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple(),
    }),
  );
};
