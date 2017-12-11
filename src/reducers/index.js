import { combineReducers } from 'redux'
import console from './console'
import client from './client'
import form from './form'

const reducers = combineReducers({
  client,
  console,
  form
})

export default reducers