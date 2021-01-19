import React, { Fragment, useEffect, useState } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { useSelector, shallowEqual } from 'react-redux'
import { DocumentHeader, Link } from '@asl/components';

import ScrollToTop from './components/scroll-to-top';
import SyncHandler from './components/sync-handler';
import Section from './pages/section';
import Project from './pages/project';
import ProtocolSummary from './pages/sections/protocols/summary-table';

import { formatDate } from './helpers';
import { DATE_FORMAT } from './constants';

const selector = ({
  project: version,
  application: {
    project,
    basename,
    drafting,
    isGranted,
    legacyGranted,
    establishment,
    schemaVersion
  }
}) => {
  return {
    project,
    version,
    basename,
    drafting,
    isGranted,
    legacyGranted,
    establishment,
    schemaVersion
  };
};

const ProjectRouter = () => {
  const [statusShowing, setStatusShowing] = useState(true);
  const {
    project,
    version,
    basename,
    drafting,
    establishment,
    schemaVersion
  } = useSelector(selector, shallowEqual);

  function toggleStatusShowing() {
    setStatusShowing(!statusShowing);
  }

  useEffect(() => {
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

  const versionModel = (project.versions || []).find(v => v.id === version.id) || {};

  const isApplication = project.status === 'inactive';
  const isAmendment = project.status === 'active' && versionModel.status !== 'granted';

  let title = isApplication
    ? 'Project licence application'
    : (isAmendment ? 'Project licence amendment' : 'Project licence');

  if (schemaVersion === 'RA') {
    title = 'Retrospective assessment';
  }

  const docxType = isApplication
    ? 'application'
    : (isAmendment ? 'amendment' : 'application');

  const projectTitle = project.title || version.title || 'Untitled project'

  return (
    <BrowserRouter basename={basename}>
      <ScrollToTop>
        <SyncHandler />
        <DocumentHeader
          title={title}
          subtitle={projectTitle}
          detailsLabel="details and downloads"
          backLink={<Link page="project.read" label="Go to project overview" establishmentId={establishment.id} projectId={project.id} />}
        >
          <dl>
            <dt>Project title</dt>
            <dd>{version.title}</dd>

            <dt>Licence holder</dt>
            <dd>{`${project.licenceHolder.firstName} ${project.licenceHolder.lastName}`}</dd>

            <dt>Licence number</dt>
            <dd>{project.licenceNumber || '-'}</dd>

            <dt>Primary establishment</dt>
            <dd>{project.establishment.name}</dd>

            { project.expiryDate &&
              <Fragment>
                <dt>Expiry date</dt>
                <dd>{formatDate(project.expiryDate, DATE_FORMAT.long)}</dd>
              </Fragment>
            }

            { project.raDate &&
              <Fragment>
                <dt>Retrospective assessment due</dt>
                <dd>{formatDate(project.raDate, DATE_FORMAT.long)}</dd>
              </Fragment>
            }

            { project.amendedDate &&
              <Fragment>
                <dt>Last amended</dt>
                <dd>{formatDate(project.amendedDate, DATE_FORMAT.long)}</dd>
              </Fragment>
            }

            <dt>Downloads</dt>
            <dd>
              <ul>
                <li><Link page="projectVersion.pdf" label="Download licence as a PDF" establishmentId={establishment.id} projectId={project.id} versionId={version.id} /></li>
                {
                  (isApplication || isAmendment) &&
                  <li>
                    <Link page="projectVersion.docx" label={`Download ${docxType} as a DOCX`} establishmentId={establishment.id} projectId={project.id} versionId={version.id} />
                  </li>
                }
              </ul>
            </dd>
          </dl>
        </DocumentHeader>

        <Switch>
          <Route path="/protocol-summary" component={ProtocolSummary} />
          <Route path="/:section/:step?" render={props => <Section { ...props } drafting={drafting} />} />
          <Route path="/" component={Project} />
        </Switch>

      </ScrollToTop>
    </BrowserRouter>
  )
};

export default ProjectRouter;
