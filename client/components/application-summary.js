import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import map from 'lodash/map';
import values from 'lodash/values';
import flatten from 'lodash/flatten';
import every from 'lodash/every';

import { INCOMPLETE, PARTIALLY_COMPLETE, COMPLETE } from '../constants/completeness';

import { Badge, Button } from '@ukhomeoffice/react-components';

const mapStateToProps = (state, props) => {
  const project = state.projects.find(project => project.id === props.project);
  return {
    values: project,
    sections: state.application
  };
}

class ApplicationSummary extends React.Component {

  isCompleted = () => {
    const subsections = flatten(map(this.props.sections, section => values(section.subsections))).map(this.complete)
    return every(subsections, complete => complete === COMPLETE);
  }

  complete = subsection => {
    let completeness = INCOMPLETE;
    if (typeof subsection.complete === 'function') {
      completeness = subsection.complete(this.props.values) || INCOMPLETE;
    } else if (Array.isArray(subsection.fields)) {
      const fields = subsection.fields.map(f => f.name);
      const completed = fields.filter(f => this.props.values[f]);
      if (completed.length === 0) {
        completeness = INCOMPLETE;
      } else if (completed.length < subsection.fields.length) {
        completeness = PARTIALLY_COMPLETE;
      } else if (completed.length === subsection.fields.length) {
        completeness = COMPLETE;
      }
    }

    return completeness;
  }

  completeBadge = completeness => {
    switch (completeness) {
      case COMPLETE:
        return <span className="badge complete">complete</span>;
      case PARTIALLY_COMPLETE:
        return <span className="badge incomplete">incomplete</span>;
      default:
        return null;
    }
  }

  sectionVisible = section => {
    return !section.show || section.show(this.props.values);
  }

  render() {
    if (!this.props.values) {
      return null;
    }
    return (
      <Fragment>
        {
          Object.keys(this.props.sections).map(key => {
            const section = this.props.sections[key];
            const subsections = Object.keys(section.subsections)
              .filter(subsection => this.sectionVisible(section.subsections[subsection]));

            if (!subsections.length) {
              return null;
            }

            return <Fragment key={key}>
              <h2>{ section.title }</h2>
              <table className="govuk-table">
                <tbody>
                {
                  subsections.map(key => {
                    const subsection = section.subsections[key];
                    return <tr key={key}>
                      <td><Link to={`/project/${this.props.project}/${key}`}>{ subsection.title }</Link></td>
                      <td>{ this.completeBadge(this.complete(subsection)) }</td>
                    </tr>
                  })
                }
                </tbody>
              </table>
            </Fragment>
          })
        }
        <Fragment>
          <p>All sections must be marked as complete before you can continue and send your application to the Home Office</p>
          <Button
            disabled={!this.isCompleted()}
            onClick={() => console.log('complete')}
          >Continue</Button>
        </Fragment>
      </Fragment>
    )
  }

}

export default connect(mapStateToProps)(ApplicationSummary);
