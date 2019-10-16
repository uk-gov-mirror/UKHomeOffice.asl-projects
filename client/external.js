import './polyfills';

import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';

import Alert from './components/alert';
import ErrorBoundary from './components/error-boundary';
import ProjectRouter from './project-router';
import configureStore from './store';

const renderApp = initialState => {
  const store = configureStore(initialState);
  render(
    <ErrorBoundary
      message="The application is unavailable"
      section={true}
    >
      <Provider store={store}>
        <React.Fragment>
          <Alert />
          <ProjectRouter />
        </React.Fragment>
      </Provider>
    </ErrorBoundary>,
    document.getElementById('ppl-drafting-tool')
  );
}

export default renderApp;
