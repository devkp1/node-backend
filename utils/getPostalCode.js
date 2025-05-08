import axios from 'axios';
import https from 'https';

export const getPostalCode = async (cityName, stateCode, countryCode) => {
  try {
    const response = await axios.get(
      `https://api.zippopotam.us/${countryCode}/${stateCode}/${cityName}`,
      {
        httpsAgent: new https.Agent({
          rejectUnauthroized: false,
          keepAlive: true,
          minVersion: 'TLSv1.2',
        }),
      },
    );

    const postalcodeDetails = response.data.places.map(
      (detail) => detail['post code'],
    );

    return postalcodeDetails;
  } catch (error) {
    if (error) {
      return [];
    }
  }
};
