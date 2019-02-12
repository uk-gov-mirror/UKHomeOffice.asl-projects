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
        <DownloadLink project={project.id} label=".docx" renderer="docx" />
        <DownloadLink project={project.id} label=".ppl" renderer="ppl" />
      </span>
      <Link to="/">Back to project list</Link>
    </p>
    <ApplicationSummary />
  </Fragment>
};

const mapStateToProps = ({ project }) => ({ project });

export default connect(mapStateToProps)(Index);
