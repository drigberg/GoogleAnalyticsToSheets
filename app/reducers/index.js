import { combineReducers } from 'redux';
import console from './console';
import clients from './clients';
import form from './form';

const reducers = combineReducers({
  clients,
  console,
  form
});

export default reducers;
