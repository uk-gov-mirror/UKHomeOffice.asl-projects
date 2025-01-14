import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import moment from 'moment';
import DropZone from 'react-dropzone';

import { Button } from '@ukhomeoffice/react-components';

import { deleteProject, importProject, createProject } from '../actions/projects';
import { throwError } from '../actions/messages';

import DownloadLink from '../components/download-link';

const mapStateToProps = ({ projects, settings: { establishments } }) => ({ projects, establishments });

const mapDispatchToProps = dispatch => {
  return {
    error: message => dispatch(throwError(message)),
    import: data => dispatch(importProject(data)),
    remove: id => dispatch(deleteProject(id)),
    create: project => dispatch(createProject(project))
  };
}

class Index extends React.Component {

  drop(files) {
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const obj = JSON.parse(reader.result);
          this.props.import(obj);
        } catch (e) {
          return this.props.error(`Error importing file: ${e.message}`);
        }
      };
      reader.readAsText(file);
    });
  }

  create = () => {
    this.props.create({})
      .then(project => {
        this.props.history.push(`/project/${project.id}/introduction`);
      });
  }

  render() {
    if (!this.props.establishments || !this.props.establishments.length) {
      this.props.history.push('/settings');
    }
    return <DropZone
      onDrop={files => this.drop(files)}
      activeClassName="import-active"
      rejectClassName="import-rejected"
      style={{}}
      disableClick={true}
      >
      <h1>Your projects</h1>
      <Link to="/settings" className="float-right">Settings</Link>
      <table className="govuk-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Updated</th>
            <th></th>
            <th></th>
            <th></th>
          </tr>
        </thead>
        <tbody>
        {
          this.props.projects.map(project => {
            return <tr key={ project.id }>
              <td><Link to={`/project/${project.id}`}>{ project.title || 'Untitled project' }</Link></td>
              <td>{ moment(project.updated).format('D MMMM YYYY, HH:mm') }</td>
              <td>
                <DownloadLink project={project.id} label="Word (.docx)" renderer="docx" />
              </td>
              <td>
                <DownloadLink project={project.id} label="Backup (.ppl)" renderer="ppl" />
              </td>
              <td className="controls">
                <button onClick={() => this.props.remove(project.id)} className="govuk-button">Remove</button>
              </td>
            </tr>
          })
        }
        </tbody>
      </table>
      <p className="control-panel">
        <Button onClick={this.create}>Add new project</Button>
        <span>or drag an exported .ppl file onto this window to import it.</span>
      </p>
    </DropZone>;
  }

}

export default connect(mapStateToProps, mapDispatchToProps)(Index);
