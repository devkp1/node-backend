import { errorResponse } from '../utils/responseHandler.js';
import { ValidationErrorMessage } from '../constants/errorMessages.js';
import { statusCodes } from '../constants/statusCodeMessages.js';

export const validateInput = (schema, data, res) => {
  const { error } = schema.validate(data);
  if (error) {
    errorResponse(
      res,
      new Error(ValidationErrorMessage),
      error.details.map((detail) => detail.message).join(', '),
      statusCodes.VALIDATION_ERROR,
    );
    return false;
  }
  return true;
};
