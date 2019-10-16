import '@babel/polyfill';
import './polyfills';

import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';

import Alert from './components/alert';
import Router from './router';
import configureStore from './store';
import ErrorBoundary from './components/error-boundary';

import { loadProjects } from './actions/projects';
import { loadSettings } from './actions/settings';

const store = configureStore({ application: { drafting: true } });

store.dispatch(loadSettings())
  .then(() => store.dispatch(loadProjects()))
  .then(() => renderApp());

const renderApp = () => render(
  <ErrorBoundary
    message="The application is unavailable"
    section={true}
  >
    <Provider store={store}>
      <React.Fragment>
        <Alert />
        <Router />
      </React.Fragment>
    </Provider>
  </ErrorBoundary>,
  document.getElementById('ppl-drafting-tool')
);
