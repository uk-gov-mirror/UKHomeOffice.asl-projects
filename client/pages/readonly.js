import React, { Fragment } from 'react';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import DownloadHeader from '../components/download-header';
import Header from '../components/header';
import SideNav from '../components/side-nav';
import StaticSection from '../components/static-section';

function Readonly({ establishment, isGranted, project, options, schemaVersion, showConditions }) {
  const title = project.title || 'Untitled project';
  return (
    <Fragment>
      {
        isGranted && establishment && <h3 className="est-title">{establishment.name}</h3>
      }
      {
        isGranted
          ? <DownloadHeader title={title} />
          : <Header
            title={title}
            subtitle={establishment && establishment.name}
          />
      }
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

export default withRouter(connect(mapStateToProps)(Readonly));
