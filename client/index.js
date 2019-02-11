import './polyfills';

import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { render } from 'react-dom';
import { Provider } from 'react-redux';

import ScrollToTop from './components/scroll-to-top';
import Alert from './components/alert';
import Index from './pages/index';
import Settings from './pages/settings';
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
      <BrowserRouter>
        <Switch>
          <Route path="/settings" component={ Settings } />
          <Route path="/" component={ Index } />
        </Switch>
      </BrowserRouter>
    </React.Fragment>
  </Provider>,
  document.getElementById('app')
);
