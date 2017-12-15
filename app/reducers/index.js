import { combineReducers } from 'redux';
import console from './console';
import clients from './clients';
import form from './form';
import ids from './ids';
import logger from './logger';

const reducers = combineReducers({
  clients,
  console,
  form,
  ids,
  logger
});

export default reducers;
