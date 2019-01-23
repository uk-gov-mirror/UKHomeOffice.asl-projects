import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import ScrollToTop from './components/scroll-to-top';

import Index from './pages/index';
import Project from './pages/project';
import Section from './pages/section';
import Settings from './pages/settings';

export default () => <BrowserRouter onUpdate={() => window.scrollTo(0, 0)}>
  <ScrollToTop>
    <Switch>
      <Route path="/settings" component={ Settings } />
      <Route path="/project/:id/:section/:step?" component={ Section } />
      <Route path="/project/:id" component={ Project } />
      <Route path="/" component={ Index } />
    </Switch>
  </ScrollToTop>
</BrowserRouter>;
