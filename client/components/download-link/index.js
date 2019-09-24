import React from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';
import isEmpty from 'lodash/isEmpty';
import docxRenderer from './renderers/docx';
import pplRenderer from './renderers/ppl';
import schemaMap from '../../schema';

const mapStateToProps = (state, props) => {
  const values = !isEmpty(state.project)
    ? state.project
    : state.projects.find(project => project.id === props.project);
  const schema = schemaMap[state.application.schemaVersion];
  const sections = Object.values(schema());

  return {
    values,
    sections,
    application: state.application
  };
};

class DownloadLink extends React.Component {
  generate = () => {
    return Promise.resolve()
      .then(() => this.props.renderer === 'ppl' ? pplRenderer : docxRenderer)
      .then(renderer => renderer(this.props.application).render(this.props));
  };

  render() {
    if (!this.props.project) {
      return null;
    }

    return (
      <a className={classnames('download', this.props.className)} href='#' onClick={this.generate}>
        {this.props.label || 'Download'}
      </a>
    );
  }
}

export default connect(mapStateToProps)(DownloadLink);
