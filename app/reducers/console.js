import {
  SET_INPUT_HANDLER,
  REMOVE_INPUT_HANDLER,
} from '../constants/actionTypes';

const $console = (state = {}, action) => {
  switch (action.type) {
    case SET_INPUT_HANDLER:
      return { inputHandler: action.handler };
    case REMOVE_INPUT_HANDLER:
      return { inputHandler: '' };
    default:
      return state;
  }
};

export default $console;
