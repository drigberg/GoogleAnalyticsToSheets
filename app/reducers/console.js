const $console = (state = {}, action) => {
  switch (action.type) {
    case 'SHOW_INPUT':
      return Object.assign(state, { inputVisible: true, inputHandler: action.handler });
    case 'HIDE_INPUT':
      return Object.assign(state, { inputVisible: false, inputHandler: null });
    default:
      return state;
  }
};

export default $console;
