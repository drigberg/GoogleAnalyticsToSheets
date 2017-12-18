const form = (state = { metrics: [], dimensions: [] }, action) => {
  let index;
  switch (action.type) {
    case 'addCheckbox':
      state[action.className].push(action.id);

      return Object.assign({}, state);
    case 'removeCheckbox':
      index = state[action.className].indexOf(action.id);
      state[action.className].splice(index, 1);

      return Object.assign({}, state);
    default:
      return state;
  }
};

export default form;
