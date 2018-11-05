import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';

import Alert from './components/alert';
import Router from './router';
import configureStore from './store';

import { loadProjects } from './actions/projects';

const store = configureStore();

store.dispatch(loadProjects());

render(
  <Provider store={store}>
    <React.Fragment>
      <Alert />
      <Router />
    </React.Fragment>
  </Provider>,
  document.getElementById('app')
);
