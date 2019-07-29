import React, { useEffect, useState } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import DownloadHeader from './components/download-header';
import ScrollToTop from './components/scroll-to-top';
import Section from './pages/section';
import Project from './pages/project';

const ProjectRouter = ({ basename, onUpdate, onComplete, drafting }) => {
  const [statusShowing, setStatusShowing] = useState(true);

  function toggleStatusShowing() {
    setStatusShowing(!statusShowing);
  }

  useEffect(() => {
    if (drafting) {
      return () => {}
    }
    const licenceStatusBanner = document.querySelector('.licence-status-banner');
    const showHide = licenceStatusBanner.querySelector('.toggle-switch a');
    const statusDetails = licenceStatusBanner.querySelector('.status-details');
    showHide.onclick = () => {
      if (statusShowing) {
        statusDetails.classList.add('hidden');
        licenceStatusBanner.classList.remove('open');
        showHide.innerText = 'Show more'
      } else {
        statusDetails.classList.remove('hidden');
        licenceStatusBanner.classList.add('open');
        showHide.innerText = 'Show less'
      }
      toggleStatusShowing();
    }
  });

  return (
    <BrowserRouter basename={basename}>
      <ScrollToTop>
        <DownloadHeader drafting={drafting} basename={basename} />
        <Switch>
          <Route path="/:section/:step?" render={ props => <Section { ...props} onUpdate={onUpdate} /> } />
          <Route path="/" render={ props => <Project {...props} onComplete={onComplete} /> }  />
        </Switch>
      </ScrollToTop>
    </BrowserRouter>
  )
};

export default ProjectRouter;
