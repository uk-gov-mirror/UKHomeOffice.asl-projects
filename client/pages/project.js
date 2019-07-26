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

  return <ApplicationSummary onComplete={onComplete} />
};

const mapStateToProps = ({ project, application: { isGranted, schemaVersion } }) => ({ project, isGranted, schemaVersion });

export default connect(mapStateToProps)(Index);
