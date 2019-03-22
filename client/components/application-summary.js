import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import map from 'lodash/map';
import pickBy from 'lodash/pickBy';
import every from 'lodash/every';
import some from 'lodash/some';

import { Button } from '@ukhomeoffice/react-components';

import { INCOMPLETE, PARTIALLY_COMPLETE, COMPLETE } from '../constants/completeness';
import schema from '../schema'

const mapStateToProps = ({ project, application: { schemaVersion, readonly } }) => {
  return {
    readonly,
    legacy: schemaVersion === 0,
    values: project,
    sections: schema[schemaVersion]
  };
}

class ApplicationSummary extends React.Component {

  isCompleted = () => {
    if (this.props.legacy) {
      return true;
    }
    const subsections = map(
      map(this.props.sections, section => pickBy(section.subsections, this.sectionVisible))
        .reduce((obj, values) => ({ ...obj, ...values }), {}),
      this.complete
    );

    return every(subsections, complete => complete === COMPLETE);
  }

  complete = (subsection, key) => {
    if (typeof subsection.complete === 'function') {
      return subsection.complete(this.props.values) || INCOMPLETE;
    }

    let completeness = INCOMPLETE;

    if (this.props.values[`${key}-complete`]) {
      completeness = COMPLETE;
    }

    else if (Array.isArray(subsection.fields)) {
      if (some(subsection.fields, field => this.props.values[field.name])) {
        completeness = PARTIALLY_COMPLETE;
      }
    }
    return completeness;
  }

  completeBadge = completeness => {
    if (this.props.legacy) {
      return null;
    }
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
                      <td><Link to={`/${key}`}>{ subsection.title }</Link></td>
                      {
                        !this.props.readonly
                          ? <td>{ this.completeBadge(this.complete(subsection, key)) }</td>
                          : <td></td>
                      }
                    </tr>
                  })
                }
                </tbody>
              </table>
            </Fragment>
          })
        }
        {
          !this.props.readonly && (
            <Fragment>
              {
                !this.props.legacy && <p>All sections must be marked as complete before you can continue and send your application to the Home Office.</p>
              }
              <Button
                disabled={!this.isCompleted()}
                onClick={this.props.onComplete}
              >Continue</Button>
            </Fragment>
          )
        }
      </Fragment>
    )
  }

}

export default connect(mapStateToProps)(ApplicationSummary);
