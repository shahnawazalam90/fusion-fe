import { SET_USER, SET_POSTS, SET_CURRENT_SCENARIO } from './actionTypes';

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
