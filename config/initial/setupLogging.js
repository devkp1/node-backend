import winston from 'winston';

export const setUpLogger = (logger) => {
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple(),
    }),
  );
};
