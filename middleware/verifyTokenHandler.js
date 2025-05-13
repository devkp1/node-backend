import jwt from 'jsonwebtoken';
import logger from '../logger.js';
import dotenv from 'dotenv';
import {
  BlackListedTokenMessage,
  InvalidTokenErrorMessage,
  ValidationErrorMessage,
} from '../constants/errorMessages.js';
import { errorResponse } from '../utils/responseHandler.js';
import { statusCodes } from '../constants/statusCodeMessages.js';
import { isTokenBlackListed } from '../utils/tokenManager.js';
dotenv.config();

export const verifyToken = (req, res, next) => {
  const token = req.token;

  if (!token) {
    return errorResponse(
      res,
      new Error(ValidationErrorMessage),
      InvalidTokenErrorMessage,
      statusCodes.VALIDATION_ERROR,
    );
  }

  if (isTokenBlackListed(token)) {
    return errorResponse(
      res,
      new Error('Token is blacklisted'),
      blackListedTokenMessage,
      statusCodes.UNAUTHORIZED,
    );
  }

  try {
    const decodeData = jwt.verify(token, process.env.SECRET_TOKEN);

    req.user = decodeData;
    next();
  } catch (error) {
    logger.error(`JWT verification error: ${error.message}`);
    return errorResponse(
      res,
      new Error(ValidationErrorMessage),
      InvalidTokenErrorMessage,
      statusCodes.VALIDATION_ERROR,
    );
  }
};
