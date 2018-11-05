import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { Badge } from '@ukhomeoffice/react-components';

const mapStateToProps = (state, props) => {
  const project = state.projects.find(project => project.id === props.project);
  return {
    values: project,
    sections: state.application
  };
}

const mapDispatchToProps = (dispatch, props) => {
  return {};
}

class ApplicationSummary extends React.Component {

  complete(key) {
    const fields = this.props.sections[key].fields.map(f => f.name);
    const incomplete = fields.filter(f => !this.props.values[f]).length;

    return incomplete ? <span className="badge incomplete">incomplete</span> : <span className="badge complete">complete</span>;
  }

  sectionVisible (section) {
    return !section.show || section.show(this.props.values);
  }

  render() {
    if (!this.props.values) {
      return null;
    }
    return <table className="govuk-table">
      <tbody>
      {
        Object.keys(this.props.sections).map(key => {
          const section = this.props.sections[key];
          if (!this.sectionVisible(section)) {
            return null;
          }
          return <tr key={key}>
            <td><Link to={`/project/${this.props.project}/${key}`}>{ section.label }</Link></td>
            <td>{ this.complete(key) }</td>
          </tr>
        })
      }
      </tbody>
    </table>
  }

}

export default connect(mapStateToProps, mapDispatchToProps)(ApplicationSummary);
