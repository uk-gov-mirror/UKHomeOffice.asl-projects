import React, { useEffect, useState } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { useSelector } from 'react-redux'

import DownloadHeader from './components/download-header';
import ScrollToTop from './components/scroll-to-top';
import Section from './pages/section';
import Project from './pages/project';

const ProjectRouter = ({ basename, onUpdate, onComplete, drafting }) => {
  const [statusShowing, setStatusShowing] = useState(true);
  const isSyncing = useSelector(state => state.application.isSyncing);

  function toggleStatusShowing() {
    setStatusShowing(!statusShowing);
  }

  useEffect(() => {
    window.onbeforeunload = () => {
      if (isSyncing) {
        return 'Data is currently being saved, if you leave this page your recent changes may not be saved.';
      }
    }

    const nextSteps = document.querySelector('#page-component > p.next-steps > a');
    const statusMessage = document.querySelector('#page-component > p.next-steps > span.status-message');

    if (isSyncing) {
      nextSteps.setAttribute('disabled', true);
      nextSteps.onclick = () => false;
      statusMessage && statusMessage.innerText = 'Saving...';
    } else {
      nextSteps.removeAttribute('disabled');
      nextSteps.onclick = null;
      statusMessage && statusMessage.innerText = '';
    }

    return () => {
      window.onbeforeunload = null;
      nextSteps.removeAttribute('disabled');
      nextSteps.onclick = null;
      statusMessage && statusMessage.innerText = '';
    }
  })

  useEffect(() => {
    if (drafting) {
      return;
    }

    const licenceStatusBanner = document.querySelector('.licence-status-banner');

    if (!licenceStatusBanner) {
      return;
    }

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
    return () => {
      showHide.onclick = null;
    };
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
