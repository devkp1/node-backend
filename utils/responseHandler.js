const { SERVER_ERROR } = require('../constants/statusCodeMessages.js');

const successResponse = (res, data, message = 'Success', statusCode = 200) => {
  res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

const errorResponse = (
  res,
  error,
  message = 'An error occured',
  statusCode = SERVER_ERROR,
) => {
  res.status(statusCode).json({
    success: false,
    message,
    error: error.message || error,
  });
};

module.exports = {
  successResponse,
  errorResponse,
};
