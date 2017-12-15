import { combineReducers } from 'redux';
import console from './console';
import clients from './clients';
import form from './form';
import ids from './ids';

const reducers = combineReducers({
  clients,
  console,
  form,
  ids
});

export default reducers;
