import React from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';
import { pack } from 'utf8-buffer';
import { fromByteArray } from 'base64-js';

const mapStateToProps = (state, props) => {
  const project = state.projects.find(project => project.id === props.project);
  return {
    data: project,
  };
}

class ExportLink extends React.Component {

  encode() {
    const bytes = [];
    pack(JSON.stringify(this.props.data), bytes);
    return fromByteArray(bytes);
  }

  render() {
    if (!this.props.project) {
      return null;
    }
    return <a className={classnames('download', this.props.className)} href={`data:application/json;base64,${this.encode()}`} download={`${this.props.data.title}.json`}>Export</a>
  }

}

export default connect(mapStateToProps)(ExportLink);
