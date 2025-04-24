import axios from 'axios';
import store from '../store';

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
  (error) => Promise.reject(error)
);

export default http;
