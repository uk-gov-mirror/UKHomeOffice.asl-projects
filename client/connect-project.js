import React, { Component } from 'react';
import { connect } from 'react-redux';

import { setProject } from './actions/projects'
import ProjectRouter from './project-router';

class ConnectProject extends Component {
  componentDidMount() {
    const id = parseInt(this.props.match.params.id, 10);
    const project = this.props.projects.find(p => p.id === id);
    if (project) {
      this.props.setProject(project);
    }
  }
  render() {
    return (
      <ProjectRouter basename={`/project/${this.props.match.params.id}`} />
    );
  }
}

const mapStateToProps = ({ projects }) => ({ projects });

export default connect(mapStateToProps, { setProject })(ConnectProject);
