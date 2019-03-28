import React, { Fragment } from 'react';
import { connect } from 'react-redux';

import ApplicationSummary from '../components/application-summary';
import DownloadLink from '../components/download-link';
import Header from '../components/header';

const Index = ({ establishment, project, onComplete = () => window.alert('Submitting to ASRU through this tool is not currently supported.') }) => {
  if (!project) {
    return null
  }

  return <Fragment>
    <Header
      title={establishment}
      subtitle={project.title || 'Untitled project'}
    />
    <p className="controls">
      <span className="float-right">Download as:
        <DownloadLink project={project.id} label="Word (.docx)" renderer="docx" />
        <DownloadLink project={project.id} label="Backup (.ppl)" renderer="ppl" />
      </span>
      <a href="/">Back to project list</a>
    </p>
    <ApplicationSummary onComplete={onComplete} />
  </Fragment>
};

const mapStateToProps = ({ project, application: { establishment } }) => ({ project, establishment });

export default connect(mapStateToProps)(Index);
