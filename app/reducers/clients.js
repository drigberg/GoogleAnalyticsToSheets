const clients = (state = {}, action) => {
  switch (action.type) {
    case 'saveSheetsClient':
      return Object.assign({}, state, { sheets: action.client });
    case 'saveAnalyticsClient':
      return Object.assign({}, state, { analytics: action.client });
    default:
      return state;
  }
};

export default clients;
