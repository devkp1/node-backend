import {
  NotFoundErrorMessage,
  PostalCodeEmptyParamterMessage,
  PostalCodeNotFoundMessage,
  ServerErrorMessage,
  ValidationErrorMessage,
} from '../../../constants/errorMessages.js';
import { PostalCodeGetSuccessfully } from '../../../constants/responseMessages.js';
import { statusCodes } from '../../../constants/statusCodeMessages.js';
import {
  errorResponse,
  successResponse,
} from '../../../utils/responseHandler.js';
import logger from '../../../logger.js';
import City from '../models/cityModel.js';

export const getPostalCodeByLocation = async (req, res) => {
  try {
    let { cityName } = req.query;

    if (!cityName) {
      return errorResponse(
        res,
        new Error(ValidationErrorMessage),
        PostalCodeEmptyParamterMessage,
        statusCodes.VALIDATION_ERROR,
      );
    }

    cityName =
      cityName.charAt(0).toUpperCase() + cityName.slice(1).toLowerCase();

    const postalCode = await City.find({ name: cityName });

    if (!postalCode) {
      return errorResponse(
        res,
        new Error(NotFoundErrorMessage),
        PostalCodeNotFoundMessage,
        statusCodes.NOT_FOUND,
      );
    }

    const formattedPostalCode = postalCode.map((postCode) => ({
      id: postCode._id,
      name: postCode.name,
      stateCode: postCode.stateCode,
      countryCode: postCode.countryCode,
      postalCode: postCode.postalCode,
    }));

    return successResponse(
      res,
      formattedPostalCode,
      PostalCodeGetSuccessfully,
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
