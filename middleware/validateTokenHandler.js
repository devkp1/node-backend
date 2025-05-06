import dotenv from 'dotenv';
import {
  ForbiddenErrorMessage,
  TokenErrorMessage,
} from '../constants/errorMessages.js';
import { errorResponse } from '../utils/responseHandler.js';
import { statusCodes } from '../constants/statusCodeMessages.js';
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

  req.token = token;
  next();
};
