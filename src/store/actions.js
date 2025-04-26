import { SET_USER, SET_POSTS, SET_CURRENT_SCENARIO, SET_CURRENT_SCENARIO_VALUE, SET_USER_SCENARIOS, SET_USER_REPORTS } from './actionTypes';

export const setUser = (user) => ({
  type: SET_USER,
  payload: user,
});

export const setPosts = (posts) => ({
  type: SET_POSTS,
  payload: posts,
});

export const setCurrentScenario = (scenario) => ({
  type: SET_CURRENT_SCENARIO,
  payload: scenario,
});

export const setCurrentScenarioValue = (parentIndex, childIndex, value) => ({
  type: SET_CURRENT_SCENARIO_VALUE,
  payload: { parentIndex, childIndex, value },
});

export const setUserScenarios = (scenarios) => ({
  type: SET_USER_SCENARIOS,
  payload: scenarios,
});

export const setUserReports = (reports) => ({
  type: SET_USER_REPORTS,
  payload: reports,
});
