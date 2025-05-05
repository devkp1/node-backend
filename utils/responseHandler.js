import { errorMessage, successMessage } from '../constants/responseMessages.js';
import { statusCodes } from '../constants/statusCodeMessages.js';

const successResponse = (
  res,
  data,
  message = successMessage,
  statusCode = statusCodes.SUCCESS,
  token,
) => {
  res.status(statusCode).json({
    status: true,
    message,
    data,
    token,
  });
};

const errorResponse = (
  res,
  error,
  message = errorMessage,
  statusCode = statusCodes.SERVER_ERROR,
) => {
  res.status(statusCode).json({
    status: false,
    message,
    error: error.message || error,
  });
};

export { successResponse, errorResponse };
