import { SET_USER, SET_POSTS, SET_CURRENT_SCENARIO, SET_CURRENT_SCENARIO_VALUE, SET_USER_SCENARIOS, SET_USER_REPORTS } from './actionTypes';
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

        // Create a deep copy of currentScenario
        const currentScenario = state.currentScenario.map((scenario, index) => 
          index === parentIndex
            ? {
                ...scenario,
                actions: scenario.actions.map((action, idx) =>
                  idx === childIndex ? { ...action, value } : action
                ),
              }
            : scenario
        );

        return { ...state, currentScenario };
      }
    case SET_USER_SCENARIOS:
      return { ...state, userScenarios: action.payload };
    case SET_USER_REPORTS:
      return { ...state, userReports: action.payload };
    default:
      return state;
  }
};

export default rootReducer;
