import React from 'react';
import { withRouter } from 'react-router';

import { connect } from 'react-redux';

import map from 'lodash/map';
import findKey from 'lodash/findKey';
import isFunction from 'lodash/isFunction';
import isEmpty from 'lodash/isEmpty';

import Review from './review';
import schemaMap from '../schema';

const getUrl = (section, step) => {
  let url = '';
  if (section) {
    url = `${url}/${section}`;
  }
  if (step) {
    url = `${url}/${step}`;
  }
  return url;
};

const Playback = ({ project, step, history, field, section, readonly, basename, title, isPdf }) => {
  if (!project || !field || isEmpty(field)) {
    return null;
  }
  const page = getUrl(section, step);
  const hint = readonly && !isPdf ? <span>From <a href={`${basename}${page}`}>{title}</a></span> : null;
  return (
    <div className="playback">
      <Review
        { ...field }
        label={field.playbackLabel || field.label}
        hint={hint}
        value={project[field.name]}
        onEdit={() => history.push(page)}
      />
    </div>
  );
};

const mapStateToProps = ({
  application: {
    schemaVersion,
    readonly,
    basename
  },
  project,
  static: {
    isPdf
  }
},
{ playback }) => {
  playback = isFunction(playback) ? playback(project) : playback;
  if (!playback) {
    return null;
  }
  let step;
  let field;
  const schema = schemaMap[schemaVersion];
  const subsections = map(schema(), section => section.subsections).reduce((obj, subsections) => ({ ...obj, ...subsections }), {});
  const section = findKey(subsections, subsection => {
    if (subsection.steps) {
      return subsection.steps.find((s, index) => {
        field = s.fields.find(f => f.name === playback);
        if (field) {
          step = index;
          return true;
        }
      });
    }
    field = (subsection.fields || []).find(f => f.name === playback);
    return field;
  });
  return {
    field,
    step,
    section,
    project,
    readonly,
    basename,
    title: subsections[section].title,
    isPdf
  };
};

export default withRouter(connect(mapStateToProps)(Playback));
