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
    project
  };
};

const mapDispatchToProps = (dispatch, props) => {
  return {};
};

class Index extends React.Component {

  render() {
    if (!this.props.project) {
      return null;
    }
    return <React.Fragment>
      <h1>{ this.props.project.title }</h1>
      <h2>Sections</h2>
      <ApplicationSummary project={ this.props.project.id } />
      <p className="control-panel">
        <Link to="/">&lt; Back to project list</Link>
        <a href={`data:application/json;base64,${window.btoa(JSON.stringify(this.props.project))}`} download={`${this.props.project.title}.json`}>Export</a>
      </p>
    </React.Fragment>
  }

}

export default connect(mapStateToProps, mapDispatchToProps)(Index);
