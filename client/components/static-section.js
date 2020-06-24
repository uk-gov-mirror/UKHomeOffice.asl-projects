import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import flatten from 'lodash/flatten';
import get from 'lodash/get';
import ReviewFields from './review-fields';
import PDFProtocols from '../pages/sections/granted/pdf-protocols';

function getComponent(section, isGranted, isFullApplication, pdf) {
  if (pdf && section.name === 'protocols') {
    return PDFProtocols;
  }

  const GrantedReview = get(section, 'granted.review');

  if (isGranted && !isFullApplication && GrantedReview) {
    return GrantedReview;
  }

  return section.review || ReviewFields;
}

const StaticSection = ({ section, project, fields = [], isGranted, subsection = false, ...props }) => {
  const Component = getComponent(section, isGranted, props.isFullApplication, props.pdf);

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
