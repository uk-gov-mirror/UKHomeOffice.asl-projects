import './polyfills';

import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { render } from 'react-dom';
import { Provider } from 'react-redux';

import Alert from './components/alert';

import Section from './pages/section';
import Project from './pages/project';

const start = ({ store, basename, root = 'app' }) => render(
  <Provider store={store}>
    <React.Fragment>
      <Alert />
      <BrowserRouter basename={basename}>
        <Switch>
          <Route path="/:section/:step?" component={ Section } />
          <Route path="/" component={ Project } />
        </Switch>
      </BrowserRouter>
    </React.Fragment>
  </Provider>,
  document.getElementById(root)
);

module.exports = start;
