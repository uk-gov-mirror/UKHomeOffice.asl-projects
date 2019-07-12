import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import { getGrantedSubsections } from '../schema'
import ApplicationSummary from '../components/application-summary';
import DownloadLink from '../components/download-link';

const Index = ({
  project,
  isGranted,
  schemaVersion,
  onComplete = () => window.alert('Submitting to ASRU through this tool is not currently supported.')
}) => {
  if (!project) {
    return null
  }

  if (isGranted) {
    const subsections = getGrantedSubsections(schemaVersion);
    return <Redirect to={`/${Object.keys(subsections)[0]}`} />;
  }

  return <Fragment>
    <p className="controls">
      <span className="float-right">Download as:
        <DownloadLink project={project.id} label="Word (.docx)" renderer="docx" />
        <DownloadLink project={project.id} label="Backup (.ppl)" renderer="ppl" />
      </span>
    </p>
    <ApplicationSummary onComplete={onComplete} />
  </Fragment>
};

const mapStateToProps = ({ project, application: { establishment, isGranted, schemaVersion } }) => ({ project, establishment, isGranted, schemaVersion });

export default connect(mapStateToProps)(Index);
