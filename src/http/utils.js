import http from './http';

export const get = async (url, params = {}) => {
  try {
    const response = await http.get(url, { params });
    return response.data;
  } catch (error) {
    console.error('GET request failed:', error);
    throw error;
  }
};

export const post = async (url, data = {}) => {
  try {
    const response = await http.post(url, data);
    return response.data;
  } catch (error) {
    console.error('POST request failed:', error);
    throw error;
  }
};
