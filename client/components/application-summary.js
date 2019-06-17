import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import map from 'lodash/map';
import pickBy from 'lodash/pickBy';
import every from 'lodash/every';
import some from 'lodash/some';
import omit from 'lodash/omit';
import mapValues from 'lodash/mapValues';
import flatten from 'lodash/flatten';

import { Button } from '@ukhomeoffice/react-components';

import { INCOMPLETE, PARTIALLY_COMPLETE, COMPLETE } from '../constants/completeness';
import { LATEST, GRANTED } from '../constants/change';
import schema from '../schema'
import { flattenReveals, getNewComments } from '../helpers';

import NewComments from './new-comments';

const getFields = subsection => {
  if (!subsection.repeats && subsection.fields && subsection.fields.length) {
    return subsection.fields
  }
  else if (subsection.steps) {
    return flatten(subsection.steps.filter(s => !s.repeats).map(step => step.fields))
  }
  else return []
}

const mapStateToProps = ({
  project,
  comments,
  application: {
    schemaVersion,
    readonly,
    showComments,
    user,
    showConditions
  },
  changes: {
    latest,
    granted
  }
}) => {
  const fieldsBySection = Object.values(schema[schemaVersion]).map(section => section.subsections).reduce((obj, subsections) => {
    return {
      ...obj,
      ...mapValues(subsections, subsection => flattenReveals(getFields(subsection), project).map(field => field.name))
    }
  }, {});
  return {
    readonly,
    showComments,
    showConditions,
    newComments: getNewComments(comments, user),
    fieldsBySection: omit(fieldsBySection, 'protocols'),
    legacy: schemaVersion === 0,
    values: project,
    sections: schema[schemaVersion],
    latest,
    granted
  };
}

class ApplicationSummary extends React.Component {

  isCompleted = () => {
    if (this.props.legacy) {
      return true;
    }
    const subsections = map(
      map(pickBy(this.props.sections, section => !section.show || section.show(this.props)), section => pickBy(section.subsections, this.sectionVisible))
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

  changed = (key, subsection) => {
    const fields = this.props.fieldsBySection[key] || [];
    if (this.props.latest.includes(key) || this.props.latest.some(k => fields.includes(k)) || this.props.latest.includes(subsection.repeats)) {
      return LATEST;
    }
    else if (this.props.granted.includes(key) || this.props.granted.some(k => fields.includes(k) || this.props.granted.includes(subsection.repeats))) {
      return GRANTED;
    }
  }

  changedBadge = change => {
    switch (change) {
      case LATEST:
        return <span className="badge changed">changed</span>;
      case GRANTED:
        return <span className="badge">amended</span>;
      default:
        return null;
    }
  }

  sectionVisible = section => {
    return !section.show || section.show(this.props.values);
  }

  getComments = (key, subsection) => {
    let newComments = 0;

    if (subsection.repeats) {
      newComments += flatten(Object.keys(this.props.newComments)
        .filter(key => key.match(new RegExp(`^${subsection.repeats}\\.`)))
        .map(key => this.props.newComments[key])).length;
    }

    newComments += (this.props.fieldsBySection[key] || []).reduce((total, field) => {
      return total + (this.props.newComments[field] || []).length
    }, 0);

    return <NewComments comments={newComments} />
  }

  render() {
    if (!this.props.values) {
      return null;
    }
    return (
      <Fragment>
        {
          Object.keys(this.props.sections).filter(section => !this.props.sections[section].show || this.props.sections[section].show(this.props)).map(key => {
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
                      <td className="controls">
                        {
                          this.props.showComments && this.getComments(key, subsection)
                        }
                        {
                          this.changedBadge(this.changed(key, subsection))
                        }
                        {
                          !this.props.readonly && this.completeBadge(this.complete(subsection, key))
                        }
                      </td>
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
