const form = (state = { metrics: [], dimensions: [] }, action) => {
  switch (action.type) {
    case 'addCheckbox':
      state[action.className].push(action.id)

      return state
    case 'removeCheckbox':
      let index = state[action.className].indexOf(action.id)
      state[action.className].splice(index, 1)

      return state
    default:
      return state
  }
}

export default form
