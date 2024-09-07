import axios from 'axios';
import Constants from 'expo-constants';

const { GOOGLE_MAPS_API_KEY } = Constants.expoConfig.extra;

export const geocodeZipCode = async (zipCode) => {
  try {
    const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json`, {
      params: {
        address: zipCode,
        key: GOOGLE_MAPS_API_KEY,
      },
      headers: {
        'Cache-Control': 'no-cache',
      },
    });

    if (response.data.status === 'OK' && response.data.results.length > 0) {
      const location = response.data.results[0]?.geometry?.location;
      if (location) {
        return {
          latitude: location.lat,
          longitude: location.lng,
        };
      }
    } else if (response.data.status === 'ZERO_RESULTS') {
      console.error('Nenhum resultado encontrado para o código postal fornecido.');
    } else {
      console.error('Erro retornado pela API de geocodificação:', response.data.status);
    }
  } catch (error) {
    console.error('Erro ao geocodificar o zip_code:', error);
  }
  return null;
};

export const geocodeAddress = async (address) => {
  try {
    const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json`, {
      params: {
        address: address,
        key: GOOGLE_MAPS_API_KEY,
      },
      headers: {
        'Cache-Control': 'no-cache',
      },
    });

    if (response.data.status === 'OK' && response.data.results.length > 0) {
      const location = response.data.results[0]?.geometry?.location;
      if (location) {
        return {
          latitude: location.lat,
          longitude: location.lng,
        };
      }
    } else if (response.data.status === 'ZERO_RESULTS') {
      console.error('Nenhum resultado encontrado para o endereço fornecido.');
    } else {
      console.error('Erro retornado pela API de geocodificação:', response.data.status);
    }
  } catch (error) {
    console.error('Erro ao geocodificar o endereço:', error);
  }
  return null;
};
