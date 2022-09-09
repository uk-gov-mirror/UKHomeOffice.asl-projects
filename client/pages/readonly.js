import React, { Fragment, useEffect } from 'react';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import SideNav from '../components/side-nav';
import StaticSection from '../components/static-section';
import ErrorBoundary from '../components/error-boundary';

import { keepAlive } from '../actions/session';

function Readonly({ isGranted, project, options, schemaVersion, showConditions, keepAlive, location, match }) {

  useEffect(() => {
    keepAlive();
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
            activeSection={match.params.section}
          />
          <span>&nbsp;</span>
        </div>
        <div className="govuk-grid-column-two-thirds">
          <ErrorBoundary
            message="Sorry, there is a problem with this section"
            section={true}
            details={`Section: ${options.title}`}
          >
            <StaticSection section={options} />
          </ErrorBoundary>
        </div>
      </div>
    </Fragment>
  );
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
