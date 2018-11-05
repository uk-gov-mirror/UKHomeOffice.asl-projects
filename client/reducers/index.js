import { combineReducers } from 'redux';

import projects from './projects';
import application from './application';
import message from './message';

const rootReducer = combineReducers({
  projects,
  application,
  message
});

export default rootReducer;
