import {
  CitiesNotFoundMessage,
  CityEmptyParameterMessage,
  NotFoundErrorMessage,
  ServerErrorMessage,
  ValidationErrorMessage,
} from '../../../constants/errorMessages.js';
import { cityGetSuccessfully } from '../../../constants/responseMessages.js';
import { statusCodes } from '../../../constants/statusCodeMessages.js';
import logger from '../../../logger.js';
import {
  errorResponse,
  successResponse,
} from '../../../utils/responseHandler.js';
import City from '../models/cityModel.js';

export const getCitiesByStateCode = async (req, res) => {
  try {
    let { countryCode, stateCode } = req.params;
    countryCode = countryCode.toUpperCase();
    stateCode = stateCode.toUpperCase();

    if (!countryCode || !stateCode) {
      return errorResponse(
        res,
        new Error(ValidationErrorMessage),
        CityEmptyParameterMessage,
        statusCodes.VALIDATION_ERROR,
      );
    }

    const cities = await City.find({ countryCode, stateCode });

    if (cities.length === 0) {
      return errorResponse(
        res,
        new Error(NotFoundErrorMessage),
        CitiesNotFoundMessage,
        statusCodes.NOT_FOUND,
      );
    }

    return successResponse(
      res,
      cities,
      cityGetSuccessfully,
      statusCodes.SUCCESS,
    );
  } catch (error) {
    logger.error(`getCitiesByStateCode error......... ${error.message}`);
    return errorResponse(
      res,
      error,
      ServerErrorMessage,
      statusCodes.SERVER_ERROR,
    );
  }
};
