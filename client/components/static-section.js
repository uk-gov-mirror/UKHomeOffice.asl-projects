import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import flatten from 'lodash/flatten';
import ReviewFields from './review-fields';
import PDFProtocols from '../pages/sections/granted/pdf-protocols';

const StaticSection = ({ section, project, fields = [], isGranted, subsection = false, ...props }) => {
  let Component = isGranted && !props.isFullApplication
    ? (section.granted && section.granted.review) || section.review || ReviewFields
    : section.review || ReviewFields;

  if (props.pdf && section.name === 'protocols') {
    Component = PDFProtocols
  }

  return (
    <Fragment>
      {
        (!props.pdf || props.isLegacy) && (
          <Fragment>
            {
              subsection || props.isLegacy
                ? <h2>{section.title}</h2>
                : <h1>
                  {
                    isGranted
                      ? (section.granted && section.granted.title) || section.title
                      : section.title
                  }
                </h1>
            }
          </Fragment>
        )
      }
      <Component {...section} fields={fields} values={project} {...props} />
    </Fragment>
  )
}

const mapStateToProps = ({ project, application: { isGranted, schemaVersion, isFullApplication } }, { section }) => {
  const fields = flatten([
    ...(section.fields || []),
    ...(section.steps || []).filter(step => !step.show || step.show(project)).map(step => step.fields)
  ]);

  return {
    project,
    fields,
    isGranted,
    isLegacy: schemaVersion === 0,
    isFullApplication
  }
}

export default connect(mapStateToProps)(StaticSection);
