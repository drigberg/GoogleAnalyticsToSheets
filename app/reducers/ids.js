import {
  SAVE_IDS,
  SAVE_SPREADSHEET_ID,
  SAVE_SPREADSHEET_TAB,
  SAVE_VIEW_ID
} from '../constants/actionTypes';

const clients = (state = {}, action) => {
  switch (action.type) {
    case SAVE_IDS:
      return {
        ...state,
        spreadsheet: action.ids.spreadsheet,
        spreadsheetTab: action.ids.spreadsheetTab,
        view: action.ids.view
      };
    case SAVE_SPREADSHEET_ID:
      return {
        ...state,
        spreadsheet: action.spreadsheetId,
      };
    case SAVE_SPREADSHEET_TAB:
      return {
        ...state,
        spreadsheetTab: action.spreadsheetTab,
      };
    case SAVE_VIEW_ID:
      return {
        ...state,
        view: action.viewId
      };
    default:
      return state;
  }
};

export default clients;
