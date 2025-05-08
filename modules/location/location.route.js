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
  .route('/get-state')
  .get(isAuthenticateUser, verifyToken, getStatesByCountryCode);
locationRoute
  .route('/get-city')
  .get(isAuthenticateUser, verifyToken, getCitiesByStateCode);
locationRoute
  .route('/get-postal-code')
  .get(isAuthenticateUser, verifyToken, getPostalCodeByLocation);

export default locationRoute;
