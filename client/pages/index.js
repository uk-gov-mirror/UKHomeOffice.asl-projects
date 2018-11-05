import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import moment from 'moment';

import { deleteProject } from '../actions/projects';

const mapStateToProps = state => {
  return {
    projects: state.projects
  };
}
const mapDispatchToProps = dispatch => {
  return {
    remove: id => dispatch(deleteProject(id))
  };
}

class Index extends React.Component {
  render() {
    return <React.Fragment>
      <table className="govuk-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Updated</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
        {
          this.props.projects.map(project => {
            return <tr key={ project.id }>
              <td><Link to={`/project/${project.id}`}>{ project.title }</Link></td>
              <td>{ moment(project.updated).format('D MMMM YYYY, HH:mm') }</td>
              <td><button onClick={() => this.props.remove(project.id)} className="govuk-button">Remove</button></td>
            </tr>
          })
        }
        </tbody>
      </table>
      <p><Link to="/new" className="govuk-button">Create project</Link></p>
    </React.Fragment>;
  }

}

export default connect(mapStateToProps, mapDispatchToProps)(Index);
