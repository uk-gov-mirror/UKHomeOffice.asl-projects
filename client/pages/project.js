import React, { Fragment } from 'react';
import { connect } from 'react-redux';

import ApplicationSummary from '../components/application-summary';
import DownloadLink from '../components/download-link';

const Index = ({ project, title }) => {
  if (!project) {
    return null
  }
  return (
    <Fragment>
      <h1>{ project.title || 'Untitled project' }</h1>
      <p className="controls">
        <DownloadLink className="float-right" project={project.id} label="Export" renderer="ppl" />
        <a href="/">Back to project list</a>
      </p>
      <ApplicationSummary />
    </Fragment>
  )
}

const mapStateToProps = ({ project }) => ({ project });

export default connect(mapStateToProps)(Index);
