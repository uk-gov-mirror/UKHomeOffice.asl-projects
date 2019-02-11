import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import ScrollToTop from './components/scroll-to-top';

import Index from './pages/index';
import Settings from './pages/settings';

export default ({ basename = '/' }) => <BrowserRouter>
  <ScrollToTop>
    <Switch>
      <Route path="/settings" component={ Settings } />
      <Route path="/" component={ Index } />
    </Switch>
  </ScrollToTop>
</BrowserRouter>;
