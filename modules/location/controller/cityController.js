import {
  CitiesNotFoundMessage,
  CityEmptyParameterMessage,
  NotFoundErrorMessage,
  ServerErrorMessage,
  ValidationErrorMessage,
  StateNotFoundMessage,
  CountriesNotFoundMessage,
} from '../../../constants/errorMessages.js';
import { cityGetSuccessfully } from '../../../constants/responseMessages.js';
import { statusCodes } from '../../../constants/statusCodeMessages.js';
import logger from '../../../logger.js';
import {
  errorResponse,
  successResponse,
} from '../../../utils/responseHandler.js';
import City from '../models/cityModel.js';
import State from '../models/stateModel.js';
import Country from '../models/countryModel.js';

export const getCitiesByStateCode = async (req, res) => {
  try {
    const { countryCode, stateCode } = req.query;

    if (!countryCode || !stateCode) {
      return errorResponse(
        res,
        new Error(ValidationErrorMessage),
        CityEmptyParameterMessage,
        statusCodes.VALIDATION_ERROR,
      );
    }

    const normalizedCountryCode = countryCode.toUpperCase();
    const normalizedStateCode = stateCode.toUpperCase();

    const state = await State.findOne({ isoCode: normalizedStateCode });
    if (!state) {
      logger.error(`State with code ${normalizedStateCode} not found`);
      return errorResponse(
        res,
        new Error(NotFoundErrorMessage),
        StateNotFoundMessage,
        statusCodes.NOT_FOUND,
      );
    }

    const country = await Country.findOne({ isoCode: normalizedCountryCode });
    if (!country) {
      logger.error(`Country with code ${normalizedCountryCode} not found`);
      return errorResponse(
        res,
        new Error(NotFoundErrorMessage),
        CountriesNotFoundMessage,
        statusCodes.NOT_FOUND,
      );
    }

    const cities = await City.find({
      stateCode: normalizedStateCode,
      countryCode: normalizedCountryCode,
    });

    if (cities.length === 0) {
      return errorResponse(
        res,
        new Error(NotFoundErrorMessage),
        CitiesNotFoundMessage,
        statusCodes.NOT_FOUND,
      );
    }

    const formattedCities = cities.map((city) => ({
      id: city._id,
      name: city.name,
      postalCode: city.postalCode,
      state: {
        id: state._id,
        isoCode: state.isoCode,
      },
      country: {
        id: country._id,
        isoCode: country.isoCode,
      },
    }));

    return successResponse(
      res,
      formattedCities,
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
