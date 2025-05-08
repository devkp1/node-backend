import {
  CountriesNotFoundMessage,
  NotFoundErrorMessage,
  ServerErrorMessage,
} from '../../../constants/errorMessages.js';
import { countryGetSuccessfully } from '../../../constants/responseMessages.js';
import { statusCodes } from '../../../constants/statusCodeMessages.js';
import logger from '../../../logger.js';
import {
  errorResponse,
  successResponse,
} from '../../../utils/responseHandler.js';
import Country from '../models/countryModel.js';

export const getAllCountries = async (req, res) => {
  try {
    const countries = await Country.find();

    if (countries.lenngth === 0) {
      return errorResponse(
        res,
        new Error(NotFoundErrorMessage),
        CountriesNotFoundMessage,
        statusCodes.NOT_FOUND,
      );
    }

    return successResponse(
      res,
      countries,
      countryGetSuccessfully,
      statusCodes.SUCCESS,
    );
  } catch (error) {
    logger.error(`getAllCountry error......... ${error.message}`);
    return errorResponse(
      res,
      error,
      ServerErrorMessage,
      statusCodes.SERVER_ERROR,
    );
  }
};
