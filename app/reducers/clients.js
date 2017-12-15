const clients = (state = {}, action) => {
  switch (action.type) {
    case 'saveSheetsClient':
      return Object.assign({}, state, { sheets: action.client });
    case 'saveAnalyticsClient':
      return Object.assign({}, state, { analytics: action.client });
    case 'saveOAuthToken':
      return Object.assign({}, state, { oauthToken: action.token });
    default:
      return state;
  }
};

export default clients;
