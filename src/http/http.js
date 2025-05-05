import axios from 'axios';
import store from 'src/store';
import { notify } from 'src/notify';

import { clearData } from "src/store/actions";

const http = axios.create({
  baseURL: 'http://localhost:3000',
  timeout: 10000,
});

http.interceptors.request.use(
  (config) => {
    const state = store.getState();
    const token = state.user?.token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

http.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.data?.message === 'Token expired') {
        // Handle token expiration here
        store.dispatch(clearData());
        notify.error('Session expired. Please log in again.');
    }

    return Promise.reject(error);
  }
);

export default http;
