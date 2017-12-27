import {
  SAVE_SHEETS_CLIENT,
  SAVE_ANALYTICS_CLIENT,
  SAVE_OAUTH_TOKEN
} from '../constants/actionTypes';


const clients = (state = {}, action) => {
  switch (action.type) {
    case SAVE_SHEETS_CLIENT:
      return { ...state, sheets: action.client };
    case SAVE_ANALYTICS_CLIENT:
      return { ...state, analytics: action.client };
    case SAVE_OAUTH_TOKEN:
      return { ...state, oauthToken: action.token };
    default:
      return state;
  }
};

export default clients;
