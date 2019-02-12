import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import ScrollToTop from './components/scroll-to-top';
import Section from './pages/section';
import Project from './pages/project';

const ProjectRouter = ({ basename, onUpdate }) => (
  <BrowserRouter basename={basename}>
    <ScrollToTop>
      <Switch>
        <Route path="/:section/:step?" render={ props => <Section { ...props} onUpdate={onUpdate} /> } />
        <Route path="/" component={ Project } />
      </Switch>
    </ScrollToTop>
  </BrowserRouter>
);

module.exports = ProjectRouter;
