import { combineReducers } from 'redux';

import projects from './projects';
import application from './application';
import message from './message';
import settings from './settings';

const rootReducer = combineReducers({
  projects,
  application,
  message,
  settings
});

export default rootReducer;
