import { post, get, put, del } from 'src/http/utils';
import store from 'src/store';
import { setRequests } from 'src/store/actions';

// Create a new request
export const createRequest = async (request) => {
  const url = '/api/v1/requests';
  const payload = new URLSearchParams();
  payload.append('name', request.name);
  payload.append('method', request.method);
  payload.append('url', request.url);
  payload.append('headers', JSON.stringify(request.headers));
  payload.append('expectedResponse', JSON.stringify(request.expectedResponse));
  payload.append('payload', JSON.stringify(request.payload));
  payload.append('type', request.type);
  if (request.type === 'polling') {
    payload.append('pollingOptions', JSON.stringify({ pollingInterval: request.pollingInterval, pollingTimeout: request.pollingTimeout }));
  }

  try {
    const response = await post(url, payload);
    return response;
  } catch (error) {
    console.error('Create request failed:', error);
    throw error;
  }
};

// List all requests
export const listRequests = async () => {
  const url = '/api/v1/requests';
  try {
    const response = await get(url);
    // store the fetched data to redux
    store.dispatch(setRequests(response.data));
    return response;
  } catch (error) {
    console.error('List requests failed:', error);
    throw error;
  }
};

// Get a single request by ID
export const getRequest = async (id) => {
  const url = `/api/v1/requests/${id}`;
  try {
    const response = await get(url);
    return response;
  } catch (error) {
    console.error('Get request failed:', error);
    throw error;
  }
};

// Update a request by ID
export const updateRequest = async (id, request) => {
  const url = `/api/v1/requests/${id}`;
  const payload = new URLSearchParams();
  payload.append('name', request.name);
  payload.append('method', request.method);
  payload.append('url', request.url);
  payload.append('headers', JSON.stringify(request.headers));
  payload.append('expectedResponse', JSON.stringify(request.expectedResponse));
  payload.append('payload', JSON.stringify(request.payload));
  payload.append('type', request.type);
  if (request.type === 'polling') {
    payload.append('pollingOptions', JSON.stringify({ pollingInterval: request.pollingInterval, pollingTimeout: request.pollingTimeout }));
  }

  try {
    const response = await put(url, payload);
    return response;
  } catch (error) {
    console.error('Update request failed:', error);
    throw error;
  }
};

// Delete a request by ID
export const deleteRequest = async (id) => {
  const url = `/api/v1/requests/${id}`;
  try {
    const response = await del(url);
    return response;
  } catch (error) {
    console.error('Delete request failed:', error);
    throw error;
  }
};
