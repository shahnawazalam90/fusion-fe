import { post, get } from 'src/http/utils';
import store from 'src/store';
import { setUserReports } from 'src/store/actions';

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

export const getScenarioJSON = async (scenarios) => {
  const url = '/api/v1/reports/get-json';
  const payload = new URLSearchParams();
  payload.append('scenarios', JSON.stringify(scenarios));

  try {
    const response = await post(url, payload, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    return response;
  } catch (error) {
    console.error('Get Scenario JSON request failed:', error);
    throw error;
  }
};

export const executeScenario = async (scenarios, browser) => {
  const url = '/api/v1/reports/create';
  const payload = new URLSearchParams();
  payload.append('scenarios', JSON.stringify(scenarios));
  payload.append('browser', browser);

  try {
    const response = await post(url, payload, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    return response;
  } catch (error) {
    console.error('Execute scenario request failed:', error);
    throw error;
  }
};