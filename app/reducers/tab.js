import {
  MAIN_TAB,
  README_TAB,
  STATS_TAB
} from '../constants';

import {
  SHOW_MAIN_TAB,
  SHOW_README_TAB,
  SHOW_STATS_TAB
} from '../constants/actionTypes';

const tab = (state = MAIN_TAB, action) => {
  switch (action.type) {
    case SHOW_MAIN_TAB:
      return MAIN_TAB;
    case SHOW_README_TAB:
      return README_TAB;
    case SHOW_STATS_TAB:
      return STATS_TAB;
    default:
      return state;
  }
};

export default tab;
