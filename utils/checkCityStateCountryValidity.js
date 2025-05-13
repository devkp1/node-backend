import {
  CityIsNotValidAsPerStateAndCountryMessage,
  CityStateCountryDoNotMatchMessage,
  InvalidCityIDMessage,
  InvalidCityMessage,
  InvalidCountryIDMessage,
  InvalidCountryMessage,
  InvalidStateIDMessage,
  InvalidStateMessage,
} from '../constants/errorMessages.js';
import { statusCodes } from '../constants/statusCodeMessages.js';
import City from '../modules/location/models/cityModel.js';
import Country from '../modules/location/Models/countryModel.js';
import State from '../modules/location/models/stateModel.js';
import { errorResponse } from './responseHandler.js';

export const checkCityStateCountryValidity = async (
  city,
  state,
  country,
  res,
) => {
  const cityDetails = await City.findById(city);
  if (!cityDetails) {
    return errorResponse(
      res,
      new Error(InvalidCityMessage),
      InvalidCityIDMessage,
      statusCodes.VALIDATION_ERROR,
    );
  }

  const stateDetails = await State.findById(state);
  if (!stateDetails) {
    return errorResponse(
      res,
      new Error(InvalidStateMessage),
      InvalidStateIDMessage,
      statusCodes.VALIDATION_ERROR,
    );
  }

  const countryDetails = await Country.findById(country);
  if (!countryDetails) {
    return errorResponse(
      res,
      new Error(InvalidCountryMessage),
      InvalidCountryIDMessage,
      statusCodes.VALIDATION_ERROR,
    );
  }

  if (
    cityDetails.stateCode !== stateDetails.isoCode ||
    stateDetails.countryCode !== countryDetails.isoCode
  ) {
    return errorResponse(
      res,
      new Error(CityStateCountryDoNotMatchMessage),
      CityIsNotValidAsPerStateAndCountryMessage,
      statusCodes.VALIDATION_ERROR,
    );
  }

  return { cityDetails, stateDetails, countryDetails };
};
