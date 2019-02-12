import React, { Fragment } from 'react';
import { connect } from 'react-redux';

import ApplicationSummary from '../components/application-summary';
import DownloadLink from '../components/download-link';

const Index = ({ project }) => {
  if (!project) {
    return null
  }

  return <Fragment>
    <h1>{ project.title || 'Untitled project' }</h1>
    <p className="controls">
      <span className="float-right">Download as:
        <DownloadLink project={project.id} label="Word (.docx)" renderer="docx" />
        <DownloadLink project={project.id} label="Backup (.ppl)" renderer="ppl" />
      </span>
      <a href="/">Back to project list</a>
    </p>
    <ApplicationSummary />
  </Fragment>
};

const mapStateToProps = ({ project }) => ({ project });

export default connect(mapStateToProps)(Index);
