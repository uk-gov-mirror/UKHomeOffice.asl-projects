import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import ApplicationSummary from '../components/application-summary'

const mapStateToProps = (state, props) => {
  const project = state.projects.find(project => project.id === parseInt(props.match.params.id, 10));
  if (!project) {
    return {};
  }
  return {
    title: project.title,
    id: project.id
  };
};

const mapDispatchToProps = (dispatch, props) => {
  return {};
};

class Index extends React.Component {

  render() {
    return <React.Fragment>
      <h1>{ this.props.title }</h1>
      <h2>Sections</h2>
      <ApplicationSummary project={ this.props.id } />
      <p className="control-panel"><Link to="/">&lt; Back to project list</Link></p>
    </React.Fragment>
  }

}

export default connect(mapStateToProps, mapDispatchToProps)(Index);
