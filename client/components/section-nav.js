import React from 'react';
import classnames from 'classnames';
import pickBy from 'lodash/pickBy';
import sortBy from 'lodash/sortBy';
import { useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { getSubsections, getGrantedSubsections } from '../schema';

function StepLink({ to, title, next, previous }) {
  return (
    <Link to={to} className={classnames('step-link', { next, previous })}>
      <h3>{ next ? 'Next' : 'Previous' }</h3>
      <span>{title}</span>
    </Link>
  );
}

export default function SectionNav() {
  const application = useSelector(state => state.application);
  const { schemaVersion, isGranted } = application;
  const project = useSelector(state => state.project);
  const location = useLocation();
  const sectionName = location.pathname.replace('/', '');
  let subsections = isGranted ? getGrantedSubsections(schemaVersion) : getSubsections(schemaVersion);

  subsections = pickBy(subsections, s => {
    if (isGranted) {
      return !s.granted.show || s.granted.show({ ...project, ...application });
    }
    return !s.show || s.show({ ...project, ...application });
  });

  let subsectionKeys = Object.keys(subsections);

  if (isGranted) {
    subsectionKeys = sortBy(subsectionKeys, key => subsections[key].granted.order);
  }

  const stepIndex = subsectionKeys.indexOf(sectionName);
  const nextStep = stepIndex <= subsectionKeys.length - 1 && subsectionKeys[stepIndex + 1];
  const previousStep = stepIndex > 0 && subsectionKeys[stepIndex - 1];

  function getTitle(key) {
    const section = subsections[key];
    return isGranted
      ? section.granted.title || section.title
      : section.title;
  }

  return (
    <nav className="section-nav">
      {
        previousStep && <StepLink to={previousStep} previous={true} title={getTitle(previousStep)} />
      }
      {
        nextStep && <StepLink to={nextStep} next={true} title={getTitle(nextStep)} />
      }
      <hr />
      {
        !isGranted && <Link to="/">View all sections</Link>
      }
    </nav>
  );
}
