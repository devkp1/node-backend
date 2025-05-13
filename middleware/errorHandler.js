import {
  ForbiddenErrorMessage,
  NotFoundErrorMessage,
  ServerErrorMessage,
  UnauthroizedErrorMessage,
  ValidationErrorMessage,
} from '../constants/errorMessages.js';
import { errorResponse } from '../utils/responseHandler.js';
import { statusCodes } from '../constants/statusCodeMessages.js';
import logger from '../logger.js';
import { ErrorMessage } from '../constants/responseMessages.js';
const { VALIDATION_ERROR, UNAUTHORIZED, SERVER_ERROR, FORBIDDEN, NOT_FOUND } =
  statusCodes;

export const errorHandler = (err, req, res, next) => {
  const statusCode = req.statusCode || 500;
  logger.error(`${err.message} - ${req.method} ${req.url} - ${req.ip}`);
  logger.log({
    level: 'error',
    status: statusCode,
    message: err.message,
  });

  // switch case for handling errors case.
  switch (statusCode) {
    case VALIDATION_ERROR:
      errorResponse(
        res,
        err.message,
        ValidationErrorMessage,
        statusCodes.VALIDATION_ERROR,
      );
      break;

    case NOT_FOUND:
      errorResponse(
        res,
        err.message,
        NotFoundErrorMessage,
        statusCodes.NOT_FOUND,
      );
      break;

    case UNAUTHORIZED:
      errorResponse(
        res,
        err.message,
        UnauthroizedErrorMessage,
        statusCodes.UNAUTHORIZED,
      );
      break;

    case FORBIDDEN:
      errorResponse(
        res,
        err.message,
        ForbiddenErrorMessage,
        statusCodes.FORBIDDEN,
      );
      break;

    case SERVER_ERROR:
      errorResponse(
        res,
        err.message,
        ServerErrorMessage,
        statusCodes.SERVER_ERROR,
      );
      break;

    default:
      ErrorMessage(
        res,
        err.messsage,
        ServerErrorMessage,
        statusCodes.SERVER_ERROR,
      );
      next();
  }
};
