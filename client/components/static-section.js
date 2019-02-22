import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import flatten from 'lodash/flatten';
import ReviewFields from './review-fields';

const StaticSection = ({ section, project, fields = [] }) => (
  <Fragment>
    <h1>{section.title}</h1>
    {
      section.review
        ? <section.review {...section} fields={fields} values={project} readonly={true} />
        : <ReviewFields fields={fields} values={project} readonly={true} />
    }
  </Fragment>
)

const mapStateToProps = ({ project }, { section }) => {
  const fields = flatten([
    ...(section.fields || []),
    ...((section.steps || []).map(step => step.fields) || [])
  ]);

  return {
    project,
    fields
  }
}

export default connect(mapStateToProps)(StaticSection);
