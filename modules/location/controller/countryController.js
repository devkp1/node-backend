import {
  CountriesNotFoundMessage,
  NotFoundErrorMessage,
  ServerErrorMessage,
} from '../../../constants/errorMessages.js';
import { CountryGetSuccessfully } from '../../../constants/responseMessages.js';
import { statusCodes } from '../../../constants/statusCodeMessages.js';
import logger from '../../../logger.js';
import {
  errorResponse,
  successResponse,
} from '../../../utils/responseHandler.js';
import Country from '../Models/countryModel.js';

export const getAllCountries = async (req, res) => {
  try {
    const countries = await Country.find();

    if (countries.length === 0) {
      return errorResponse(
        res,
        new Error(NotFoundErrorMessage),
        CountriesNotFoundMessage,
        statusCodes.NOT_FOUND,
      );
    }

    const formattedCountries = countries.map((country) => ({
      id: country._id,
      name: country.name,
      isoCode: country.isoCode,
      phoneCode: country.phoneCode,
      flag: country.flag,
    }));

    return successResponse(
      res,
      formattedCountries,
      CountryGetSuccessfully,
      statusCodes.SUCCESS,
    );
  } catch (error) {
    logger.error(`getAllCountries error: ${error.message}`);
    return errorResponse(
      res,
      error,
      ServerErrorMessage,
      statusCodes.SERVER_ERROR,
    );
  }
};
