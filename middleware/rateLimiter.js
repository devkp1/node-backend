import rateLimit from 'express-rate-limit';

export const rateLimiters = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 10,
  message: {
    status: false,
    message: 'Too many request from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
  },
});
