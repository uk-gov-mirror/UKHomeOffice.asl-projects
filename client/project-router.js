import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import DownloadHeader from './components/download-header';
import ScrollToTop from './components/scroll-to-top';
import Section from './pages/section';
import Project from './pages/project';

const ProjectRouter = ({ basename, onUpdate, onComplete }) => (
  <BrowserRouter basename={basename}>
    <ScrollToTop>
      <DownloadHeader />
      <Switch>
        <Route path="/:section/:step?" render={ props => <Section { ...props} onUpdate={onUpdate} /> } />
        <Route path="/" render={ props => <Project {...props} onComplete={onComplete} /> }  />
      </Switch>
    </ScrollToTop>
  </BrowserRouter>
);

export default ProjectRouter;
