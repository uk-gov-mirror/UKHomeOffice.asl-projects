import React from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';
import docxRenderer from './renderers/docx';
import pplRenderer from './renderers/ppl';

const mapStateToProps = (state, props) => {
  const project = state.project || state.projects.find(project => project.id === props.project);

  return {
    values: project,
    sections: Object.values(state.application),
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
