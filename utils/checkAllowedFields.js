import { AdditionalFeildsErrorMessage } from '../constants/errorMessages.js';
import { statusCodes } from '../constants/statusCodeMessages.js';
import { errorResponse } from './responseHandler.js';

export const checkAllowedFields = (allowedFields, reqBody, res) => {
  const extraFields = Object.keys(reqBody).filter(
    (field) => !allowedFields.includes(field),
  );
  if (extraFields.length > 0) {
    errorResponse(
      res,
      new Error(AdditionalFeildsErrorMessage),
      `These fields are not allowed: ${extraFields.join(', ')}`,
      statusCodes.VALIDATION_ERROR,
    );
    return false;
  }
  return true;
};
