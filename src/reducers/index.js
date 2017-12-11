import { combineReducers } from 'redux'
import console from './console'
import client from './client'

const reducers = combineReducers({
  client,
  console
})

export default reducers