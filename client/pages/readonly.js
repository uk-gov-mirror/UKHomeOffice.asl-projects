import React, { Fragment, useEffect } from 'react';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import SideNav from '../components/side-nav';
import StaticSection from '../components/static-section';

import { keepAlive } from '../actions/session';

function Readonly({ isGranted, project, options, schemaVersion, showConditions, keepAlive, location }) {

  useEffect(() => {
    keepAlive()
  }, [location]);

  return (
    <Fragment>
      <div className="govuk-grid-row">
        <div className="govuk-grid-column-one-third">
          <SideNav
            project={project}
            isGranted={isGranted}
            schemaVersion={schemaVersion}
            showConditions={showConditions}
          />
          <span>&nbsp;</span>
        </div>
        <div className="govuk-grid-column-two-thirds">
          <StaticSection section={options} />
        </div>
      </div>
    </Fragment>
  )
}

const mapStateToProps = ({
  application: {
    schemaVersion,
    showConditions
  }
}) => ({
  schemaVersion,
  showConditions
});

const mapDispatchToProps = dispatch => {
  return {
    keepAlive: () => dispatch(keepAlive())
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Readonly));
