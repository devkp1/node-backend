import { ErrorMessage, SuccessMessage } from '../constants/responseMessages.js';
import { statusCodes } from '../constants/statusCodeMessages.js';

const successResponse = (
  res,
  data,
  message = SuccessMessage,
  statusCode = statusCodes.SUCCESS,
) => {
  res.status(statusCode).json({
    status: SuccessMessage,
    statusCode: statusCode,
    message,
    data,
  });
};

const errorResponse = (
  res,
  error,
  message = ErrorMessage,
  statusCode = statusCodes.SERVER_ERROR,
) => {
  res.status(statusCode).json({
    status: ErrorMessage,
    statusCode: statusCode,
    message,
    error: error.message || error,
  });
};

export { successResponse, errorResponse };
