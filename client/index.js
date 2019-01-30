import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
// eslint-disable-next-line no-unused-vars
import DetailsPolyfill from 'details-element-polyfill';

import Alert from './components/alert';
import Router from './router';
import configureStore from './store';

import { loadProjects } from './actions/projects';
import { loadSettings } from './actions/settings';

const store = configureStore();

store.dispatch(loadSettings())
  .then(() => store.dispatch(loadProjects()))
  .then(() => renderApp());

const renderApp = () => render(
  <Provider store={store}>
    <React.Fragment>
      <Alert />
      <Router />
    </React.Fragment>
  </Provider>,
  document.getElementById('app')
);
