import { post } from './utils';
import store from '../store';
import { setUser, setCurrentScenario } from '../store/actions';

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
