const clients = (state = {}, action) => {
  switch (action.type) {
    case 'saveIds':
      return Object.assign({}, state, {
        spreadsheet: action.ids.spreadsheet,
        view: action.ids.view
      });
    default:
      return state;
  }
};

export default clients;
