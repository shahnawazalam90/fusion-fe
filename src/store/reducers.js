import {
  CLEAR_DATA,
  SET_MENU_VISIBILITY,
  SET_USER,
  SET_POSTS,
  SET_EDIT_SCENARIO_INFO,
  SET_CURRENT_SCENARIO,
  SET_CURRENT_SCENARIO_REQUEST_ID,
  SET_USER_SCENARIOS,
  SET_USER_REPORTS,
  SET_CURRENT_REPORT,
  SET_SCHEDULES,
  SET_REQUESTS
} from './actionTypes';
import initialState from './initialState';

const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    case CLEAR_DATA:
      return initialState;
    case SET_MENU_VISIBILITY:
      return { ...state, menu_visibility: action.payload };
    case SET_USER: // Clear all data and set user
      return { ...initialState, user: action.payload };
    case SET_POSTS:
      return { ...state, posts: action.payload };
    case SET_CURRENT_SCENARIO:
      return { ...state, currentScenario: action.payload };
    case SET_CURRENT_SCENARIO_REQUEST_ID:
      {
        if (!action.payload) return state;
        const { parentIndex, childIndex, requestId } = action.payload;

        // Create a deep copy of currentScenario
        const currentScenario = { ...state.currentScenario };

        currentScenario.screens = currentScenario?.screens?.map((scenario, index) =>
          index === parentIndex
            ? {
              ...scenario,
              actions: scenario?.actions?.map((action, idx) =>
                idx === childIndex ? { ...action, requestId } : action
              ),
            }
            : scenario
        );

        return { ...state, currentScenario };
      }
    case SET_EDIT_SCENARIO_INFO:
      return { ...state, editScenarioInfo: action.payload };
    case SET_USER_SCENARIOS:
      return { ...state, userScenarios: action.payload };
    case SET_USER_REPORTS:
      return { ...state, userReports: action.payload };
    case SET_CURRENT_REPORT:
      return {
        ...state,
        currentReport: {
          scenarioName: action.payload.scenarioName,
          reportURL: action.payload.reportURL
        }
      };
    case SET_SCHEDULES:
      return {
        ...state,
        schedules: action.payload,
      };
    case SET_REQUESTS:
      return {
        ...state,
        requests: action.payload,
      };
    default:
      return state;
  }
};

export default rootReducer;
