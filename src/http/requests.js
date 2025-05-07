import { post, get } from './utils';
import store from 'src/store';
import { setUser, setUserScenarios, setUserReports, setCurrentScenario } from 'src/store/actions';

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
  const url = '/api/v1/specs/upload';
  const formData = new FormData();
  formData.append('specFile', file);

  try {
    const response = await post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
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
    store.dispatch(setUserScenarios(response.data));
    return response;
  } catch (error) {
    console.error('Get user scenarios request failed:', error);
    throw error;
  }
};

export const postScenario = async (name, screenUrl, jsonMetaData) => {
  const url = '/api/v1/scenarios/';
  const payload = new URLSearchParams();
  payload.append('name', name);
  payload.append('url', screenUrl);
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

export const getReports = async () => {
  const url = '/api/v1/reports/';

  try {
    const response = await get(url);
    store.dispatch(setUserReports(response.data));
    return response;
  } catch (error) {
    console.error('Get reports request failed:', error);
    throw error;
  }
};

export const getLatestScenario = async () => {
  const url = '/api/v1/specs/latest';

  try {
    const response = await get(url);
    const screens = response?.data?.specFile?.parsedJson?.screens;
    const screenUrl = response?.data?.specFile?.url;
    store.dispatch(setCurrentScenario(screens));
    return {screens, url: screenUrl};
  } catch (error) {
    console.error('Get latest scenario request failed:', error);
    throw error;
  }
};

export const executeScenario = async (scenarioIds) => {
  const url = '/api/v1/reports/create';
  const payload = new URLSearchParams();
  payload.append('scenarioIds', JSON.stringify(scenarioIds));

  try {
    const response = await post(url, payload, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Execute scenario request failed:', error);
    throw error;
  }
};
