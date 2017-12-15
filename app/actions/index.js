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
