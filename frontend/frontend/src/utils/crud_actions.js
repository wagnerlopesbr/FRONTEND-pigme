import axios from 'axios';
import Constants from 'expo-constants';

const BACKEND_CRUD_URL = Constants.expoConfig.extra?.BACKEND_CRUD_URL;

const registerUser = async (userData) => {
  try {
    if (!BACKEND_CRUD_URL) {
      throw new Error('BACKEND_CRUD_URL não está definida nas constantes de configuração.');
    }

    const response = await axios.post(`${BACKEND_CRUD_URL}register/`, userData);
    return response.data;
  } catch (error) {
    console.error('Erro ao registrar usuário:', error.message || error);
    throw error;
  }
};

const loginUser = async (userData) => {
  try {
    if (!BACKEND_CRUD_URL) {
      throw new Error('BACKEND_CRUD_URL não está definida nas constantes de configuração.');
    }

    const response = await axios.post(`${BACKEND_CRUD_URL}login/`, userData);
    return response.data;
  } catch (error) {
    console.error('Erro ao logar usuário:', error.message || error);
    throw error;
  }
};

const getUser = async (token) => {
  try {
    if (!BACKEND_CRUD_URL) {
      throw new Error('BACKEND_CRUD_URL não está definida nas constantes de configuração.');
    }

    const response = await axios.get(`${BACKEND_CRUD_URL}accounts/`, {
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
    if (!BACKEND_CRUD_URL) {
      throw new Error('BACKEND_CRUD_URL não está definida nas constantes de configuração.');
    }

    const response = await axios.get(`${BACKEND_CRUD_URL}accounts/lists/`, {
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

const getPkList = async (listId, token) => {
  try {
    if (!BACKEND_CRUD_URL) {
      throw new Error('BACKEND_CRUD_URL não está definida nas constantes de configuração.');
    }

    const response = await axios.get(`${BACKEND_CRUD_URL}lists/${listId}/`, {
      headers: {
        Authorization: `Token ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar lista:', error.message || error);
    throw error;
  }
};

const createList = async (listData, token) => {
  try {
    if (!BACKEND_CRUD_URL) {
      throw new Error('BACKEND_CRUD_URL não está definida nas constantes de configuração.');
    }

    const response = await axios.post(`${BACKEND_CRUD_URL}lists/`, listData, {
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

const updateList = async (listId, listData, token) => {
  try {
    if (!BACKEND_CRUD_URL) {
      throw new Error('BACKEND_CRUD_URL não está definida nas constantes de configuração.');
    }

    const response = await axios.put(`${BACKEND_CRUD_URL}lists/${listId}/`, listData, {
      headers: {
        Authorization: `Token ${token}`,
        'Content-Type': 'application/json',
      },
    });
    console.log('response.data:', response.data);
    return response.data;
  } catch (error) {
    console.log('data:', { listId, listData, token });
    console.error('Erro ao atualizar lista:', error.message || error);
    throw error;
  }
};

export { registerUser, loginUser, createList, getLists, getUser, updateList, getPkList };
