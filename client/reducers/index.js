import { combineReducers } from 'redux';

import projects from './projects';
import project from './project';
import savedProject from './saved-project';
import application from './application';
import message from './message';
import settings from './settings';
import comments from './comments';
import changes from './changes';
import questionVersions from './question-versions';
import staticData from './static';

const rootReducer = combineReducers({
  projects,
  project,
  savedProject,
  application,
  message,
  settings,
  comments,
  changes,
  questionVersions,
  static: staticData
});

export default rootReducer;
