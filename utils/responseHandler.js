import { errorMessage, successMessage } from '../constants/responseMessages.js';
import { statusCodes } from '../constants/statusCodeMessages.js';

const successResponse = (
  res,
  data,
  message = successMessage,
  statusCode = statusCodes.SUCCESS,
) => {
  res.status(statusCode).json({
    status: successMessage,
    statusCode: statusCode,
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
    status: errorMessage,
    statusCode: statusCode,
    message,
    error: error.message || error,
  });
};

export { successResponse, errorResponse };
