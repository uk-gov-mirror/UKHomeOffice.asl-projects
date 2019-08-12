import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import { getGrantedSubsections } from '../schema'
import ApplicationSummary from '../components/application-summary';

const Index = ({
  project,
  isGranted,
  schemaVersion
}) => {
  if (!project) {
    return null
  }

  if (isGranted) {
    const subsections = getGrantedSubsections(schemaVersion);
    return <Redirect to={`/${Object.keys(subsections)[0]}`} />;
  }

  return <ApplicationSummary />
};

const mapStateToProps = ({ project, application: { isGranted, schemaVersion } }) => ({ project, isGranted, schemaVersion });

export default connect(mapStateToProps)(Index);
