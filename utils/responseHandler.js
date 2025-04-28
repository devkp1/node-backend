import { errorMessage, successMessage } from '../constants/resonseMessages.js';
import { statusCodes } from '../constants/statusCodeMessages.js';

const successResponse = (
  res,
  data,
  message = successMessage,
  statusCode = statusCodes.SUCCESS,
) => {
  res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

const errorResponse = (
  res,
  error,
  message = errorMessage,
  statusCode = statusCodes.SERVER_ERROR,
) => {
  res.status(statusCode).json({
    success: false,
    message,
    error: error.message || error,
  });
};

export { successResponse, errorResponse };
