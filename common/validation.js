import { errorResponse } from '../utils/responseHandler';
import { ValidationErrorMessage } from '../constants/errorMessages';
import { statusCodes } from '../constants/statusCodeMessages';

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
