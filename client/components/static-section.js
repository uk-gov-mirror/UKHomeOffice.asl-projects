import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import flatten from 'lodash/flatten';
import ReviewFields from './review-fields';

const StaticSection = ({ section, project, fields = [], subsection = false, ...props }) => {
  const Component = section.review || ReviewFields;
  return (
    <Fragment>
      {
        subsection
          ? <h2>{section.title}</h2>
          : <h1>{section.title}</h1>
      }
      <Component {...section} fields={fields} values={project} {...props} />
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
