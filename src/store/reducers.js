import { SET_USER, SET_POSTS } from './actionTypes';
import initialState from './initialState';

const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_USER:
      return { ...state, user: action.payload };
    case SET_POSTS:
      return { ...state, posts: action.payload };
    default:
      return state;
  }
};

export default rootReducer;
