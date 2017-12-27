import {
  ADD_CHECKBOX,
  REMOVE_CHECKBOX,
} from '../constants/actionTypes';

const form = (state = { metrics: [], dimensions: [] }, action) => {
  let index;
  switch (action.type) {
    case ADD_CHECKBOX:
      state[action.className].push(action.id);

      return { ...state };
    case REMOVE_CHECKBOX:
      index = state[action.className].indexOf(action.id);
      state[action.className].splice(index, 1);

      return { ...state };
    default:
      return state;
  }
};

export default form;
