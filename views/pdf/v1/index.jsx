import React, { Fragment } from 'react';
import classnames from 'classnames';
import { useSelector } from 'react-redux';
import map from 'lodash/map';
import { getGrantedSubsections } from '../../../client/schema';
import StaticSection from '../../../client/components/static-section';
import StandardConditions from '../components/standard-conditions';

export default function PDF() {
  const project = useSelector(state => state.project);
  const sections = Object.values(getGrantedSubsections(1))
    .filter(s => !s.granted.show || s.granted.show(project))
    .sort((a, b) => a.granted.order - b.granted.order);
  return (
    <Fragment>
      <div className="logo"></div>
      <h3 className="licence">Project licence</h3>
      <h1 className="project-title">{project.title}</h1>
      {
        sections.map((section, index) => (
          <section className={classnames('section', section.name)} key={index}>
            <StaticSection section={section} pdf />
          </section>
        ))
      }
      <StandardConditions />
    </Fragment>
  )
}
