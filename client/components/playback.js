import React from 'react';
import { withRouter } from 'react-router';

import { connect } from 'react-redux';

import map from 'lodash/map'
import findKey from 'lodash/findKey';

import Review from './review';

const getUrl = (id, section, step) => {
  let url = '';
  if (section) {
    url = `${url}/${section}`;
  }
  if (step) {
    url = `${url}/${step}`;
  }
  return url;
}

const Playback = ({ project, step, history, field, section }) => {
  if (!project || !field) {
    return null;
  }
  return (
    <div className="playback">
      <Review
        { ...field }
        label={field.playback || field.label}
        value={project[field.name]}
        onEdit={() => history.push(getUrl(project.id, section, step))}
      />
    </div>
  )
}

const mapStateToProps = ({ application, project }, { playback }) => {
  let step;
  let field;
  const subsections = map(application, section => section.subsections).reduce((obj, subsections) => ({ ...obj, ...subsections }), {});
  const section = findKey(subsections, subsection => {
    if (subsection.steps) {
      return subsection.steps.find((s, index) => {
        field = s.fields.find(f => f.name === playback)
        if (field) {
          step = index;
          return true;
        }
      });
    }
    field = subsection.fields.find(f => f.name === playback);
    return field;
  });
  return {
    field,
    step,
    section,
    project
  };
}

export default withRouter(connect(mapStateToProps)(Playback));
