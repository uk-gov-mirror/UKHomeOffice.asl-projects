import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import ApplicationSummary from '../components/application-summary';
import ExportLink from '../components/export-link';

const mapStateToProps = (state, props) => {
  const project = state.projects.find(p => p.id === props.match.params.id);
  if (!project) {
    return {};
  }
  return {
    ...project
  };
};

const Index = ({ id, title }) => (
  <Fragment>
    <h1>{ title }</h1>
    <p className="controls">
      <ExportLink className="float-right" project={id} />
      <Link to="/">Back to project list</Link>
    </p>
    <ApplicationSummary project={ id } />
  </Fragment>
);

export default connect(mapStateToProps)(Index);
