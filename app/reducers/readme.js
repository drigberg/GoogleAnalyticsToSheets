import {
  HIDE_README,
  SHOW_README
} from '../constants/actionTypes';

const readme = (state = {}, action) => {
  switch (action.type) {
    case HIDE_README:
      return { active: false };
    case SHOW_README:
      return { active: true };
    default:
      return state;
  }
};

export default readme;
