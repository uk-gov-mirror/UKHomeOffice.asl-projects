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
    schemaVersion,
    licenceHolder
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
    schemaVersion,
    licenceHolder
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
    schemaVersion,
    licenceHolder
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
  const isSuperseded = versionModel.status === 'granted' && project.granted.createdAt > versionModel.createdAt;

  const isRa = schemaVersion === 'RA';

  let title = isApplication
    ? 'Project licence application'
    : (isAmendment ? 'Project licence amendment' : 'Project licence');

  if (isRa) {
    title = 'Retrospective assessment';
  }

  const docxType = isApplication
    ? 'application'
    : (isAmendment ? 'amendment' : 'application');

  const projectTitle = version.title || project.title || 'Untitled project';


  const detailsLabel = isRa
    ? 'details'
    : 'details and downloads';

  return (
    <BrowserRouter basename={basename}>
      <ScrollToTop>
        <SyncHandler />
        <DocumentHeader
          title={title}
          subtitle={projectTitle}
          detailsLabel={detailsLabel}
          backLink={<Link page="project.read" label="Go to project overview" establishmentId={establishment.id} projectId={project.id} />}
        >
          <dl>
            <dt>Project title</dt>
            <dd>{version.title || project.title}</dd>

            <dt>Licence holder</dt>
            <dd>{`${licenceHolder.firstName} ${licenceHolder.lastName}`}</dd>

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

            { project.raDate && !isRa &&
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

            {
              !isRa && (
                <Fragment>
                  <dt>Downloads</dt>
                  <dd>
                    <ul>
                      <li><Link page="projectVersion.pdf" label="Download licence as a PDF" establishmentId={establishment.id} projectId={project.id} versionId={version.id} /></li>
                      {
                        (isApplication || isAmendment || isSuperseded) &&
                        <li>
                          <Link page="projectVersion.docx" label={`Download ${docxType} as a DOCX`} establishmentId={establishment.id} projectId={project.id} versionId={version.id} />
                        </li>
                      }
                    </ul>
                  </dd>
                </Fragment>
              )
            }
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
