import { post, put, get, del } from 'src/http/utils';
import store from 'src/store';
import { setUserScenarios, setCurrentScenario } from 'src/store/actions';

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

export const getScenarioById = async (scenarioId) => {
  const url = `/api/v1/scenarios/${scenarioId}`;

  try {
    const response = await get(url);

    const scenario = {
      screens: JSON.parse(response?.data?.jsonMetaData),
      url: response?.data?.url,
      dataManual: JSON.parse(response?.data?.dataManual),
    };

    store.dispatch(setCurrentScenario(scenario));
    return scenario;
  } catch (error) {
    console.error('Get scenario by ID request failed:', error);
    throw error;
  }
};

export const getLatestScenario = async () => {
  const url = '/api/v1/specs/latest';

  try {
    const response = await get(url);
    const screens = response?.data?.specFile?.parsedJson?.screens;
    const screenUrl = response?.data?.specFile?.url;
    store.dispatch(setCurrentScenario({ screens, url: screenUrl }));
    return { screens, url: screenUrl };
  } catch (error) {
    console.error('Get latest scenario request failed:', error);
    throw error;
  }
};

export const getScenariosJSON = async (scenarioIds) => {
  const url = '/api/v1/reports/get-json';
  const payload = new URLSearchParams();
  payload.append('scenarioIds', JSON.stringify(scenarioIds));

  try {
    const response = await post(url, payload, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    return response;
  } catch (error) {
    console.error('Get scenarios JSON request failed:', error);
    throw error;
  }
};

export const postScenario = async (name, screenUrl, jsonMetaData, dataManual) => {
  const url = '/api/v1/scenarios/';
  const payload = new URLSearchParams();
  payload.append('name', name);
  payload.append('url', screenUrl);
  payload.append('jsonMetaData', jsonMetaData);
  payload.append('dataManual', dataManual);

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

export const updateScenario = async (scenarioId, name, screenUrl, dataManual) => {
  const url = '/api/v1/scenarios/update';
  const payload = new URLSearchParams();
  payload.append('id', scenarioId);
  payload.append('name', name);
  payload.append('url', screenUrl);
  payload.append('dataManual', dataManual);

  try {
    const response = await put(url, payload, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    return response;
  } catch (error) {
    console.error('Update scenario request failed:', error);
    throw error;
  }
};

export const updateScenarioExcelData = async (scenarioId, dataExcel) => {
  const url = '/api/v1/scenarios/update';
  const payload = new URLSearchParams();
  payload.append('id', scenarioId);
  payload.append('dataExcel', dataExcel);

  try {
    const response = await put(url, payload, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    return response;
  } catch (error) {
    console.error('Update scenario request failed:', error);
    throw error;
  }
};

export const deleteScenario = async (scenarioId) => {
  const url = `/api/v1/scenarios/${scenarioId}`;

  try {
    const response = await del(url, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    return response;
  } catch (error) {
    console.error('Delete scenario request failed:', error);
    throw error;
  }
};
