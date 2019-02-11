import React, { Fragment } from 'react';
import { connect } from 'react-redux';

import ApplicationSummary from '../components/application-summary';
import DownloadLink from '../components/download-link';

const Index = ({ project, title }) => (
  <Fragment>
    <h1>{ title }</h1>
    <p className="controls">
      <DownloadLink className="float-right" project={project.id} label="Export" renderer="ppl" />
      <Link to="/">Back to project list</Link>
    </p>
    <ApplicationSummary />
  </Fragment>
);

const mapStateToProps = ({ project }) => ({ project });

export default connect(mapStateToProps)(Index);
