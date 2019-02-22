import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import ScrollToTop from './components/scroll-to-top';
import Section from './pages/section';
import Project from './pages/project';

const ProjectRouter = ({ basename, onUpdate, onComplete, readonly }) => (
  <BrowserRouter basename={basename}>
    <ScrollToTop>
      <Switch>
        <Route path="/:section/:step?" render={ props => <Section { ...props} onUpdate={onUpdate} readonly={readonly} /> } />
        <Route path="/" render={ props => <Project {...props} onComplete={onComplete} readonly={readonly} /> }  />
      </Switch>
    </ScrollToTop>
  </BrowserRouter>
);

export default ProjectRouter;
