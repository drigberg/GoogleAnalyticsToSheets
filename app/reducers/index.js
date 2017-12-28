import { combineReducers } from 'redux';
import console from './console';
import clients from './clients';
import form from './form';
import ids from './ids';
import logger from './logger';
import readme from './readme';
import tab from './tab';


const reducers = combineReducers({
  clients,
  console,
  form,
  ids,
  logger,
  readme,
  tab
});

export default reducers;
