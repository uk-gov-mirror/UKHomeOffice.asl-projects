import React from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';
import { saveAs } from 'file-saver';

const mapStateToProps = (state, props) => {
  const project = state.projects.find(project => project.id === props.project);
  return {
    data: project,
  };
}

class ExportLink extends React.Component {

  download = e => {
    e.preventDefault();
    const blob = new Blob([JSON.stringify(this.props.data)], { type: 'data:application/json' });
    saveAs(blob, `${this.props.data.title}.ppl`);
  }

  render() {
    if (!this.props.project) {
      return null;
    }
    return <a href="#" onClick={this.download} className={classnames('download', this.props.className)}>Export</a>
  }

}

export default connect(mapStateToProps)(ExportLink);
