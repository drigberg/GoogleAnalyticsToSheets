const $console = (state = {}, action) => {
  switch (action.type) {
    case 'setInputHandler':
      return { inputHandler: action.handler };
    case 'removeInputHandler':
      return { inputHandler: '' };
    default:
      return state;
  }
};

export default $console;
