import axios from 'axios';
import store from 'src/store';
import { notify } from 'src/notify';

import { clearData } from "src/store/actions";

let tokenExpiredNotified = false;

function debounceTokenExpiredNotification() {
  if (!tokenExpiredNotified) {
    tokenExpiredNotified = true;
    store.dispatch(clearData());
    notify.error('Session expired. Please log in again.');
    setTimeout(() => {
      tokenExpiredNotified = false;
    }, 2000); // 2 seconds debounce, adjust as needed
  }
}

const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
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
        debounceTokenExpiredNotification();
    }
    return Promise.reject(error);
  }
);

export default http;
