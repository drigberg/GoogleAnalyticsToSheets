const logger = (state = '', action) => {
  switch (action.type) {
    case 'logger':
      return `${state}\n${action.text}`;
    default:
      return state;
  }
};

export default logger;
