import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { Redirect, useLocation } from 'react-router-dom';
import isEmpty from 'lodash/isEmpty';
import omit from 'lodash/omit';

import { getGrantedSubsections } from '../schema'
import ApplicationSummary from '../components/application-summary';
import RaDeclaration from '../components/ra-declaration';
import RaDetails from '../components/ra-details';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const Index = ({
  project,
  isGranted,
  schemaVersion
}) => {
  const query = useQuery();
  if (!project) {
    return null
  }

  if (isGranted) {
    const subsections = getGrantedSubsections(schemaVersion);
    return <Redirect to={`/${Object.keys(subsections)[0]}`} />;
  }

  if (schemaVersion === 'RA' && isEmpty(omit(project, 'id')) && !query.get('declaration-accepted')) {
    return <RaDeclaration />
  }

  return (
    <Fragment>
      { schemaVersion === 'RA' && <RaDetails /> }
      <ApplicationSummary />
    </Fragment>
  )
};

const mapStateToProps = ({ project, application: { isGranted, schemaVersion } }) => ({ project, isGranted, schemaVersion });

export default connect(mapStateToProps)(Index);
