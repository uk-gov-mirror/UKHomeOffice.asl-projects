import { combineReducers } from 'redux';

import projects from './projects';
import project from './project';
import application from './application';
import message from './message';
import settings from './settings';

const rootReducer = combineReducers({
  projects,
  project,
  application,
  message,
  settings
});

export default rootReducer;
