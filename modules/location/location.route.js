import exporess from 'express';
import { isAuthenticateUser } from '../../middleware/validateTokenHandler.js';
import { verifyToken } from '../../middleware/verifyTokenHandler.js';
import { getAllCountries } from './controller/countryController.js';
import { getStatesByCountryCode } from './controller/stateController.js';
import { getCitiesByStateCode } from './controller/cityController.js';
import { getPostalCodeByLocation } from './controller/postalCodeController.js';

const locationRoute = exporess.Router();

locationRoute
  .route('/get-country')
  .get(isAuthenticateUser, verifyToken, getAllCountries);
locationRoute
  .route('/:countryCode')
  .get(isAuthenticateUser, verifyToken, getStatesByCountryCode);
locationRoute
  .route('/:countryCode/:stateCode')
  .get(isAuthenticateUser, verifyToken, getCitiesByStateCode);
locationRoute
  .route('/:countryCode/:stateCode/:cityName')
  .get(isAuthenticateUser, verifyToken, getPostalCodeByLocation);

export default locationRoute;
