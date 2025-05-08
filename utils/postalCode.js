import axios from 'axios';
import https from 'https';

const getPostalCode = async () => {
  try {
    const response = await axios.get(
      'https://api.zippopotam.us/in/gj/ahmedabad',
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

getPostalCode();
