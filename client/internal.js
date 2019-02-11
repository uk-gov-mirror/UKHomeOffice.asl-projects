import start from './project.js';
import configureStore from './store';
import { loadProject } from './actions/projects';
import { loadSettings } from './actions/settings';

const PROJECT_ID = parseInt(window.PROJECT_ID, 10);

const store = configureStore();

store.dispatch(loadSettings())
  .then(() => loadProject(PROJECT_ID))
  .then(() => start({ store, basename: `/project/${PROJECT_ID}` }));
