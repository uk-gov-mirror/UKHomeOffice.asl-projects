import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import ScrollToTop from './components/scroll-to-top';
import Section from './pages/section';
import Project from './pages/project';

const ProjectRouter = ({ basename }) => (
  <BrowserRouter basename={basename}>
    <ScrollToTop>
      <Switch>
        <Route path="/:section/:step?" component={ Section } />
        <Route path="/" component={ Project } />
      </Switch>
    </ScrollToTop>
  </BrowserRouter>
);

module.exports = ProjectRouter;
