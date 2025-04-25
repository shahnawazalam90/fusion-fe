import { post, get } from './utils';
import store from '../store';
import { setUser, setCurrentScenario, setUserScenarios } from '../store/actions';

export const login = async (email, password) => {
  const url = '/api/v1/auth/login';
  const payload = { email, password };

  try {
    const response = await post(url, payload);
    // Dispatch the user and token to the Redux store
    store.dispatch(setUser({
      user: response.data.user,
      token: response.data.token,
    }));
    return response;
  } catch (error) {
    console.error('Login request failed:', error);
    throw error;
  }
};

export const uploadTS = async (file) => {
  const url = '/api/v1/files/parseSpec';
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    store.dispatch(setCurrentScenario(response.data));
    return response;
  } catch (error) {
    console.error('File upload failed:', error);
    throw error;
  }
};

export const getUserScenarios = async () => {
  const url = '/api/v1/scenarios/';

  try {
    const response = await get(url);
    store.dispatch(setUserScenarios(response.data.map(scenario => ({
      ...scenario,
      jsonMetaData: JSON.parse(scenario.jsonMetaData),
    }))));
    return response;
  } catch (error) {
    console.error('Get user scenarios request failed:', error);
    throw error;
  }
};

export const postScenario = async (name, jsonMetaData) => {
  const url = '/api/v1/scenarios/';
  const payload = new URLSearchParams();
  payload.append('name', name);
  payload.append('jsonMetaData', jsonMetaData);

  try {
    const response = await post(url, payload, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    return response;
  } catch (error) {
    console.error('Post scenario request failed:', error);
    throw error;
  }
};
