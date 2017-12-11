const client = (state = {}, action) => {
  switch (action.type) {
    case 'saveOAuth2Client':
      return action.oauth2Client
    default:
      return state
  }
}

export default client
