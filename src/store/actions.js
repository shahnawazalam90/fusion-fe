import { SET_USER, SET_POSTS } from './actionTypes';

export const setUser = (user) => ({
  type: SET_USER,
  payload: user,
});

export const setPosts = (posts) => ({
  type: SET_POSTS,
  payload: posts,
});
