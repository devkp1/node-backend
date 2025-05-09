import { Country, State, City } from 'country-state-city';
import CountryModel from '../modules/location/models/countryModel.js';
import StateModel from '../modules/location/models/stateModel.js';
import CityModel from '../modules/location/models/cityModel.js';
import { getPostalCode } from './getPostalCode.js';
import logger from '../logger.js';

export const populateDatabase = async () => {
  try {
    const countries = Country.getAllCountries();
    for (const country of countries) {
      const existingCountry = await CountryModel.findOne({
        isoCode: country.isoCode,
      });
      if (!existingCountry) {
        const newCountry = new CountryModel({
          name: country.name,
          isoCode: country.isoCode,
          phoneCode: country.phoneCode,
          flag: country.flag,
        });
        await newCountry.save();
      }
    }

    for (const country of countries) {
      const states = State.getStatesOfCountry(country.isoCode);
      for (const state of states) {
        const existingState = await StateModel.findOne({
          isoCode: state.isoCode,
        });
        if (!existingState) {
          const newState = new StateModel({
            name: state.name,
            isoCode: state.isoCode,
            countryCode: state.countryCode,
          });
          await newState.save();
        }
      }
    }

    for (const country of countries) {
      const states = State.getStatesOfCountry(country.isoCode);
      for (const state of states) {
        const cities = City.getCitiesOfState(country.isoCode, state.isoCode);
        console.log(
          `Cities for state ${state.isoCode}, country ${country.isoCode}:`,
          cities,
        );

        const cityPromises = cities.map(async (city) => {
          const existingCity = await CityModel.findOne({
            name: city.name,
            stateCode: city.stateCode,
            countryCode: city.countryCode,
          });
          if (!existingCity) {
            let postalCode = [];
            try {
              postalCode = await getPostalCode(
                city.name,
                state.isoCode,
                country.isoCode,
              );
            } catch (error) {
              logger.error(
                `Failed to fetch postal code for city: ${city.name}, error: ${error.message}`,
              );
            }
            const newCity = new CityModel({
              name: city.name,
              stateCode: city.stateCode.toUpperCase(),
              countryCode: city.countryCode.toUpperCase(),
              postalCode: postalCode || [],
            });
            try {
              await newCity.save();
            } catch (error) {
              logger.error(
                `Failed to save city: ${city.name}, error: ${error.message}`,
              );
            }
          }
        });
        await Promise.all(cityPromises);
      }
    }
  } catch (error) {
    logger.error(`Location populate error: ${error.message}`);
    return error;
  }
};
