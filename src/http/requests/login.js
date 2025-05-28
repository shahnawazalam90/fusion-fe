import { post } from 'src/http/utils';
import store from 'src/store';
import { setUser } from 'src/store/actions';

export const login = async (email, password) => {
  const url = '/api/v1/auth/login';
  const payload = { email, password };

  try {
    const response = await post(url, payload);

    if (response.status === 'success') {
      await store.dispatch(setUser({
        user: response.data.user,
        token: response.data.token,
      }));
    }

    return response;
  } catch (error) {
    console.error('Login request failed:', error);
    throw error;
  }
};
