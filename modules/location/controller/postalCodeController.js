import {
  NotFoundErrorMessage,
  PostalCodeEmptyParamterMessage,
  PostalCodeNotFoundMessage,
  ServerErrorMessage,
  ValidationErrorMessage,
} from '../../../constants/errorMessages.js';
import { postalCodeGetSuccessfully } from '../../../constants/responseMessages.js';
import { statusCodes } from '../../../constants/statusCodeMessages.js';
import {
  errorResponse,
  successResponse,
} from '../../../utils/responseHandler.js';
import { getPostalCode } from '../../../utils/postalCode.js';
import logger from '../../../logger.js';

export const getPostalCodeByLocation = async (req, res) => {
  let { cityName, stateCode, countryCode } = req.params;
  cityName = cityName.charAt(0).toUpperCase() + cityName.slice(1).toLowerCase();
  stateCode = stateCode.toUpperCase();
  countryCode = countryCode.toUpperCase();

  try {
    if (!cityName || !stateCode || !countryCode) {
      return errorResponse(
        res,
        new Error(ValidationErrorMessage),
        PostalCodeEmptyParamterMessage,
        statusCodes.VALIDATION_ERROR,
      );
    }

    const postalCode = await getPostalCode(cityName, stateCode, countryCode);

    if (!postalCode) {
      return errorResponse(
        res,
        new Error(NotFoundErrorMessage),
        PostalCodeNotFoundMessage,
        statusCodes.NOT_FOUND,
      );
    }

    return successResponse(
      res,
      postalCode,
      postalCodeGetSuccessfully,
      statusCodes.SUCCESS,
    );
  } catch (error) {
    logger.error(`getPostalCodeByLocation error...... ${error.message}`);
    return errorResponse(
      res,
      error,
      ServerErrorMessage,
      statusCodes.SERVER_ERROR,
    );
  }
};
