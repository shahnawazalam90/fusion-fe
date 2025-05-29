import { post, put, get, del } from 'src/http/utils';
import store from 'src/store';
import { setSchedules } from 'src/store/actions';

export const scheduleScenario = async (scheduleName, scheduleTime, scenarios, browser) => {
  const url = '/api/v1/schedules';
  const payload = new URLSearchParams();
  payload.append('name', scheduleName);
  payload.append('scheduleTime', scheduleTime);
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
    console.error('Schedule scenario request failed:', error);
    throw error;
  }
};

export const getSchedules = async () => {
  const url = '/api/v1/schedules';
  try {
    const response = await get(url);
    store.dispatch(setSchedules(response.data));
    return response;
  } catch (error) {
    console.error('Get schedules request failed:', error);
    throw error;
  }
};

export const deleteSchedule = async (scheduleId) => {
  const url = `/api/v1/schedules/${scheduleId}`;

  try {
    const response = await del(url, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    return response;
  } catch (error) {
    console.error('Delete schedule request failed:', error);
    throw error;
  }
};

export const updateSchedule = async (scheduleId, scheduleName, scheduleTime) => {
  const url = `/api/v1/schedules/${scheduleId}`;
  const payload = new URLSearchParams();
  payload.append('name', scheduleName);
  payload.append('scheduleTime', scheduleTime);

  try {
    const response = await put(url, payload, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    return response;
  } catch (error) {
    console.error('Update schedule request failed:', error);
    throw error;
  }
};
