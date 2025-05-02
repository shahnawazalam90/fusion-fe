import { post, get } from './utils';
import store from 'src/store';
import { setUser, setUserScenarios, setUserReports, setCurrentReport } from 'src/store/actions';

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

export const postReport = async (scenarioId, file) => {
  const url = '/api/v1/reports/';
  const formData = new FormData();
  formData.append('scenarioId', scenarioId);
  formData.append('file', file);

  try {
    const response = await post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response;
  } catch (error) {
    console.error('Post report request failed:', error);
    throw error;
  }
};

export const viewReport = async (scenarioName, reportId) => {
  const url = '/api/v1/reports/view';
  const payload = new URLSearchParams();
  payload.append('reportId', reportId);

  try {
    const response = await post(url, payload, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    store.dispatch(setCurrentReport({scenarioName, reportURL: `http://localhost:3000${response.data[0].publicUrl}`}));
    return response;
  } catch (error) {
    console.error('View report request failed:', error);
    throw error;
  }
};
