const { constants } = require('../constants/constant.js');
const logger = require('../logger.js');
const { VALIDATION_ERROR, UNAUTHORIZED, SERVER_ERROR, FORBIDDEN, NOT_FOUND } =
  constants;

const errorHandler = (err, req, res) => {
  const statusCode = req.statusCode || 500;
  logger.log({
    level: 'error',
    status: statusCode,
    message: err.message,
  });

  // switch case for handling errors case.
  switch (statusCode) {
    case VALIDATION_ERROR:
      res.json({
        status: false,
        title: 'Validation failed',
        message: err.message,
        stackTrace: err.stack,
      });
      break;

    case NOT_FOUND:
      res.json({
        status: false,
        title: 'Not Found!',
        message: err.message,
        stackTrace: err.stack,
      });
      break;

    case UNAUTHORIZED:
      res.json({
        status: false,
        title: 'Unauthorized!',
        message: err.message,
        stackTrace: err.stack,
      });
      break;

    case FORBIDDEN:
      res.json({
        status: false,
        title: 'Forbidden',
        message: err.message,
        stackTrace: err.stack,
      });
      break;

    case SERVER_ERROR:
      res.json({
        status: false,
        title: 'Internal Server Error',
        message: err.message,
        stackTrace: err.stack,
      });
      break;

    default:
      res.status(500).json({
        status: false,
        title: 'Internal Server Error',
        message: err.message,
        stackTrace: err.stack,
      });
  }
};

module.exports = { errorHandler };
