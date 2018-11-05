import React from 'react';
import { connect } from 'react-redux';

const mapStateToProps = (state, props) => {
  const project = state.projects.find(project => project.id === props.project);
  return {
    data: project,
  };
}

const mapDispatchToProps = (dispatch, props) => {
  return {};
}

class ExportLink extends React.Component {

  render() {
    if (!this.props.project) {
      return null;
    }
    return <a className={this.props.className || 'govuk-button'} href={`data:application/json;base64,${window.btoa(JSON.stringify(this.props.data))}`} download={`${this.props.data.title}.json`}>Export</a>
  }

}

export default connect(mapStateToProps, mapDispatchToProps)(ExportLink);
