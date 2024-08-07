import axios from 'axios';
import Constants from 'expo-constants';

const API_URL = Constants.expoConfig.extra?.API_URL;

const registerUser = async (userData) => {
  try {
    if (!API_URL) {
      throw new Error('API_URL não está definida nas constantes de configuração.');
    }

    const response = await axios.post(`${API_URL}register/`, userData);
    return response.data;
  } catch (error) {
    console.error('Erro ao registrar usuário:', error.message || error);
    throw error;
  }
};

const loginUser = async (userData) => {
  try {
    if (!API_URL) {
      throw new Error('API_URL não está definida nas constantes de configuração.');
    }

    const response = await axios.post(`${API_URL}login/`, userData);
    return response.data;
  } catch (error) {
    console.error('Erro ao logar usuário:', error.message || error);
    throw error;
  }
};

const getUser = async (token) => {
  try {
    if (!API_URL) {
      throw new Error('API_URL não está definida nas constantes de configuração.');
    }

    const response = await axios.get(`${API_URL}accounts/`, {
      headers: {
        Authorization: `Token ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar usuário:', error.message || error);
    throw error;
  }
};

const getLists = async (token) => {
  try {
    if (!API_URL) {
      throw new Error('API_URL não está definida nas constantes de configuração.');
    }

    const response = await axios.get(`${API_URL}accounts/lists/`, {
      headers: {
        Authorization: `Token ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar listas:', error.message || error);
    throw error;
  }
};

const createList = async (listData, token) => {
  try {
    if (!API_URL) {
      throw new Error('API_URL não está definida nas constantes de configuração.');
    }

    const response = await axios.post(`${API_URL}lists/`, listData, {
      headers: {
        Authorization: `Token ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao criar lista:', error.message || error);
    throw error;
  }
};

export { registerUser, loginUser, createList, getLists, getUser };
