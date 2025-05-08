import { Country, State, City } from 'country-state-city';
import CountryModel from '../modules/location/models/countryModel.js';
import StateModel from '../modules/location/models/stateModel.js';
import CityModel from '../modules/location/models/cityModel.js';
import { getPostalCode } from './postalCode.js';
import logger from '../logger.js';

export const populateDatabase = async () => {
  try {
    const countries = Country.getAllCountries();
    for (const country of countries) {
      // eslint-disable-next-line
      const newCountry = new CountryModel({
        name: country.name,
        isoCode: country.isoCode,
        phoneCode: country.phonecode,
        flag: country.flag,
      });
      // await newCountry.save()
    }

    for (const country of countries) {
      const states = State.getStatesOfCountry(country.isoCode);
      for (const state of states) {
        // eslint-disable-next-line
        const newState = new StateModel({
          name: state.name,
          isoCode: state.isoCode,
          countryCode: state.countryCode,
        });
        // await newState.save()
      }
    }

    for (const country of countries) {
      const states = State.getStatesOfCountry(country.isoCode);
      for (const state of states) {
        const cities = City.getCitiesOfState(country.isoCode, state.isoCode);

        for (const city of cities) {
          const postalCode = await getPostalCode(
            city.name,
            state.isoCode,
            country.isoCode,
          );
          // eslint-disable-next-line
          const newCity = new CityModel({
            name: city.name,
            stateCode: city.stateCode,
            countryCode: city.countryCode,
            postalcode: postalCode,
          });
          // await newCity.save()
        }
      }
    }
  } catch (error) {
    logger.error(`Location populate error: ${error.message}`);
    return error;
  }
};
