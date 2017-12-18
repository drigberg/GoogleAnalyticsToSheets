export const saveSheetsClient = client => ({
  type: 'saveSheetsClient',
  client
});

export const saveAnalyticsClient = client => ({
  type: 'saveAnalyticsClient',
  client
});

export const addCheckbox = (className, id) => ({
  type: 'addCheckbox',
  className,
  id
});

export const removeCheckbox = (className, id) => ({
  type: 'removeCheckbox',
  className,
  id
});

export const saveOAuthToken = (token) => ({
  type: 'saveOAuthToken',
  token
});

export const saveIds = (ids) => ({
  type: 'saveIds',
  ids
});

export const logger = (text) => ({
  type: 'logger',
  text
});

export const setInputHandler = (handler) => ({
  type: 'setInputHandler',
  handler
});

export const removeInputHandler = () => ({
  type: 'removeInputHandler'
});

export const hideReadme = () => ({
  type: 'hideReadme'
});

export const showReadme = () => ({
  type: 'showReadme'
});
