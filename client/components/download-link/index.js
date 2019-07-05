import React from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';
import isEmpty from 'lodash/isEmpty';
import docxRenderer from './renderers/docx';
import pplRenderer from './renderers/ppl';
import schema from '../../schema';

const mapStateToProps = (state, props) => {
  const values = !isEmpty(state.project)
    ? state.project
    : state.projects.find(project => project.id === props.project);
  const sections = Object.values(schema[state.application.schemaVersion]);

  return {
    values,
    sections,
    optionsFromSettings: state.settings
  };
};

class DownloadLink extends React.Component {
  generate = () => {
    return Promise.resolve()
      .then(() => this.props.renderer === 'ppl' ? pplRenderer : docxRenderer)
      .then(renderer => renderer.render(this.props));
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
