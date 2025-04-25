import { SET_USER, SET_POSTS, SET_CURRENT_SCENARIO, SET_CURRENT_SCENARIO_VALUE } from './actionTypes';
import initialState from './initialState';

const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_USER:
      return { ...state, user: action.payload };
    case SET_POSTS:
      return { ...state, posts: action.payload };
    case SET_CURRENT_SCENARIO:
      return { ...state, currentScenario: action.payload };
    case SET_CURRENT_SCENARIO_VALUE:
      {
        if (!action.payload) return state;
        const { parentIndex, childIndex, value } = action.payload;
        const currentScenarioValue = [...state.currentScenarioValue];

        if (!currentScenarioValue[parentIndex]) currentScenarioValue[parentIndex] = [];
        else currentScenarioValue[parentIndex] = [...currentScenarioValue[parentIndex]];
        
        currentScenarioValue[parentIndex][childIndex] = value;
        return { ...state, currentScenarioValue };
      }
    default:
      return state;
  }
};

export default rootReducer;
