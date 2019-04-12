import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import flatten from 'lodash/flatten';
import ReviewFields from './review-fields';

const StaticSection = ({ section, project, fields = [], subsection = false }) => {
  const Component = section.review || ReviewFields;
  return (
    <Fragment>
      {
        subsection
          ? <h2>{section.title}</h2>
          : <h2>{section.title}</h2>
      }
      <Component {...section} fields={fields} values={project} />
    </Fragment>
  )
}

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
