const readme = (state = {}, action) => {
  switch (action.type) {
    case 'hideReadme':
      return Object.assign({}, { active: false });
    case 'showReadme':
      return Object.assign({}, { active: true });
    default:
      return state;
  }
};

export default readme;
