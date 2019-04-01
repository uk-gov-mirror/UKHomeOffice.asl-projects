import React from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';
import docxRenderer from './renderers/docx';
import pplRenderer from './renderers/ppl';
import pdfRenderer from './renderers/pdf';
import schema from '../../schema';

const mapStateToProps = (state, props) => {
  const values = state.project || state.projects.find(project => project.id === props.project);
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
      .then(() => {
        switch (this.props.renderer) {
          case 'ppl':
            return pplRenderer;
          case 'docx':
            return docxRenderer;
          case 'pdf':
            return pdfRenderer;
        }
      })
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
