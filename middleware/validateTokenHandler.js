import jwt from 'jsonwebtoken';
import logger from '../logger.js';
import dotenv from 'dotenv';
import {
  ForbiddenErrorMessage,
  InvalidTokenErrorMessage,
  TokenErrorMessage,
  ValidationErrorMessage,
} from '../constants/errorMessages.js';
import { errorResponse } from '../utils/responseHandler.js';
import { statusCodes } from '../constants/statusCodeMessages.js';
dotenv.config();

// middleware for verify jwt token.
export const isAuthenticateUser = async (req, res, next) => {
  try {
    const token = req.headers.authorization;

    if (!token) {
      return errorResponse(
        res,
        new Error(ForbiddenErrorMessage),
        TokenErrorMessage,
        statusCodes.FORBIDDEN,
      );
    }

    try {
      const decodeData = jwt.verify(
        token.split(' ')[1],
        process.env.SECRET_TOKEN,
      );

      req.user = decodeData;
      next();
    } catch (error) {
      logger.error(`Login error: ${error.message}`);
      return errorResponse(
        res,
        new Error(ValidationErrorMessage),
        InvalidTokenErrorMessage,
        statusCodes.VALIDATION_ERROR,
      );
    }
  } catch (error) {
    next(error);
  }
};
