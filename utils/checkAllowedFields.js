import { AdditionalFeildsErrorMessage } from '../constants/errorMessages.js';
import { statusCodes } from '../constants/statusCodeMessages.js';
import { errorResponse } from './responseHandler.js';

const validateAllowedFields = (allowedFields, obj, res) => {
  const invalidFields = Object.keys(obj).filter(
    (key) => !allowedFields.includes(key),
  );

  if (invalidFields.length > 0) {
    errorResponse(
      res,
      new Error(AdditionalFeildsErrorMessage),
      `These fields are not allowed: ${invalidFields.join(', ')}`,
      statusCodes.VALIDATION_ERROR,
    );
    return false;
  }
  return true;
};

export default validateAllowedFields;
