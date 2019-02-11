import start from './project';
import configureStore from './store';

export default (settings, initialState) => {
  const store = configureStore(initialState);
  start({
    store,
    basename: settings.basename
  });
};
