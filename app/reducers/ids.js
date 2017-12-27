import {
  SAVE_IDS,
} from '../constants/actionTypes';

const clients = (state = {}, action) => {
  switch (action.type) {
    case SAVE_IDS:
      return {
        ...state,
        spreadsheet: action.ids.spreadsheet,
        view: action.ids.view
      };
    default:
      return state;
  }
};

export default clients;
