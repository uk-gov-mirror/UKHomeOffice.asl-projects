import React from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames'

const mapStateToProps = (state, props) => {
  const project = state.projects.find(project => project.id === props.project);
  return {
    data: project,
  };
}

class ExportLink extends React.Component {

  render() {
    if (!this.props.project) {
      return null;
    }
    return <a className={classnames('download', this.props.className)} href={`data:application/json;base64,${window.btoa(JSON.stringify(this.props.data))}`} download={`${this.props.data.title}.json`}>Export</a>
  }

}

export default connect(mapStateToProps)(ExportLink);
