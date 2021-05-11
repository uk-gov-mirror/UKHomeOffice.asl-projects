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
import schemaMap from '../schema';
import { flattenReveals, getNewComments, getFields } from '../helpers';

import NewComments from './new-comments';
import ChangedBadge from './changed-badge';
import NextSteps from './next-steps';

const mapStateToProps = ({
  project,
  comments,
  application: {
    schemaVersion,
    readonly,
    showComments,
    user,
    showConditions,
    basename,
    drafting,
    project: actualProject,
    projectUrl
  }
}) => {
  const schema = schemaMap[schemaVersion];
  const fieldsBySection = Object.values(schema()).map(section => section.subsections).reduce((obj, subsections) => {
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
    sections: schema(),
    basename,
    drafting,
    project: actualProject,
    projectUrl
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

  sectionVisible = section => {
    return !section.show || section.show(this.props.values);
  }

  getCommentCount = (key, subsection) => {

    if (subsection.repeats) {
      return flatten(Object.keys(this.props.newComments)
        .filter(key => key.match(new RegExp(`^${subsection.repeats}\\.`)))
        .map(key => this.props.newComments[key])).length;
    } else {
      return (this.props.fieldsBySection[key] || []).reduce((total, field) => {
        if (field.includes('.*')) {
          const prefix = field.split('.*')[0];
          return total + Object.keys(this.props.newComments).reduce((sum, q) => {
            if (q.split('.')[0] === prefix) {
              return sum + this.props.newComments[q].length;
            }
            return sum;
          }, 0);
        }
        return total + (this.props.newComments[field] || []).length
      }, 0);
    }
  }

  getComments = (key, subsection) => {
    const newComments = this.getCommentCount(key, subsection);
    return <NewComments comments={newComments} />
  }

  onComplete = () => {
    if (this.props.drafting) {
      return window.alert('Submitting to ASRU through this tool is not currently supported.')
    }

    if (this.props.project.isLegacyStub) {
      window.location.href = this.props.basename.replace(/\/edit\/?$/, '/convert');
      return;
    }

    window.location.href = `${this.props.basename}/submit`;
  }

  render() {
    if (!this.props.values) {
      return null;
    }
    return (
      <div className="application-summary">
        {
          Object.keys(this.props.sections).filter(section => !this.props.sections[section].show || this.props.sections[section].show(this.props)).map(key => {
            const section = this.props.sections[key];
            const subsections = Object.keys(section.subsections)
              .filter(subsection => this.sectionVisible(section.subsections[subsection]));

            if (!subsections.length) {
              return null;
            }

            return <Fragment key={key}>
              {
                section.title && <h2 className="section-heading">{ section.title }</h2>
              }
              {
                section.subtitle && <h3 className="section-heading">{ section.subtitle }</h3>
              }
              <table className="govuk-table">
                <tbody>
                {
                  subsections.map(key => {
                    const subsection = section.subsections[key];
                    const fields = Object.values(this.props.fieldsBySection[key] || []);
                    if (subsection.repeats) {
                      fields.push(subsection.repeats);
                    }
                    return <tr key={key}>
                      <td><Link to={`/${key}`}>{ subsection.title }</Link></td>
                      <td className="controls">
                        {
                          this.props.showComments && this.getComments(key, subsection)
                        }
                        <ChangedBadge fields={fields} />
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
                onClick={this.onComplete}
              >{this.props.project.isLegacyStub ? 'Continue to final confirmation' : 'Continue'}</Button>
            </Fragment>
          )
        }
        <p className="back-to-project">
          <a href={this.props.projectUrl}>Back to project overview</a>
        </p>
        <NextSteps />
      </div>
    )
  }

}

export default connect(mapStateToProps)(ApplicationSummary);
