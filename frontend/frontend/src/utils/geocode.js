import axios from 'axios';
import Constants from 'expo-constants';

const { GOOGLE_MAPS_API_KEY } = Constants.expoConfig.extra;

export const geocodeZipCode = async (zipCode) => {
  try {
    const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json`, {
      params: {
        address: zipCode,
        key: GOOGLE_MAPS_API_KEY
      }
    });

    if (response.data.status === 'OK') {
      const location = response.data.results[0].geometry.location;
      return {
        latitude: location.lat,
        longitude: location.lng
      };
    } else {
      throw new Error('Geocoding API returned an error');
    }
  } catch (error) {
    console.error('Erro ao geocodificar o zip_code:', error);
    return null;
  }
};

export const geocodeAddress = async (address) => {
  try {
    const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json`, {
      params: {
        address: address,
        key: GOOGLE_MAPS_API_KEY
      }
    });

    if (response.data.status === 'OK') {
      const location = response.data.results[0].geometry.location;
      return {
        latitude: location.lat,
        longitude: location.lng
      };
    } else {
      throw new Error('Geocoding API returned an error');
    }
  } catch (error) {
    console.error('Erro ao geocodificar o endereço:', error);
    return null;
  }
};
