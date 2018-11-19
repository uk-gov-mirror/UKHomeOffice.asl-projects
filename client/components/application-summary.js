import React, { Fragment } from 'react';
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

  complete(subsection) {
    let incomplete = true;
    if (typeof subsection.complete === 'function') {
      incomplete = !subsection.complete(this.props.values);
    } else if (Array.isArray(subsection.fields)) {
      const fields = subsection.fields.map(f => f.name);
      incomplete = fields.filter(f => !this.props.values[f]).length;
    }

    return incomplete ? <span className="badge incomplete">incomplete</span> : <span className="badge complete">complete</span>;
  }

  sectionVisible (section) {
    return !section.show || section.show(this.props.values);
  }

  render() {
    if (!this.props.values) {
      return null;
    }
    return Object.keys(this.props.sections).map(key => {
      const section = this.props.sections[key];
      const subsections = Object.keys(section.subsections)
        .filter(subsection => this.sectionVisible(section.subsections[subsection]));

      if (!subsections.length) {
        return null;
      }

      return <Fragment key={key}>
        <h2>{ section.label }</h2>
        <table className="govuk-table">
          <tbody>
          {
            subsections.map(key => {
              const subsection = section.subsections[key];
              return <tr key={key}>
                <td><Link to={`/project/${this.props.project}/${key}`}>{ subsection.label }</Link></td>
                <td>{ this.complete(subsection) }</td>
              </tr>
            })
          }
          </tbody>
        </table>
      </Fragment>
    });

  }

}

export default connect(mapStateToProps, mapDispatchToProps)(ApplicationSummary);
