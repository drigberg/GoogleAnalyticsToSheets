import {
  LOGGER,
} from '../constants/actionTypes';

const logger = (state = '', action) => {
  switch (action.type) {
    case LOGGER:
      return `${state}\n${action.text}`;
    default:
      return state;
  }
};

export default logger;
