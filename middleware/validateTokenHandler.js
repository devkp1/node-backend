import dotenv from 'dotenv';
import {
  blackListedTokenMessage,
  ForbiddenErrorMessage,
  TokenErrorMessage,
} from '../constants/errorMessages.js';
import { errorResponse } from '../utils/responseHandler.js';
import { statusCodes } from '../constants/statusCodeMessages.js';
import { isTokenBlackListed } from '../utils/tokenManager.js';
dotenv.config();

export const isAuthenticateUser = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return errorResponse(
      res,
      new Error(ForbiddenErrorMessage),
      TokenErrorMessage,
      statusCodes.FORBIDDEN,
    );
  }

  const token = authHeader.split(' ')[1];

  if (isTokenBlackListed(token)) {
    return errorResponse(
      res,
      new Error('Token is blacklisted'),
      blackListedTokenMessage,
      statusCodes.UNAUTHORIZED,
    );
  }

  req.token = token;
  next();
};
