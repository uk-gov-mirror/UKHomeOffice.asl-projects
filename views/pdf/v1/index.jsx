import React, { Fragment } from 'react';
import classnames from 'classnames';
import ReactMarkdown from 'react-markdown';
import { connect } from 'react-redux';
import map from 'lodash/map';
import { getGrantedSubsections } from '../../../client/schema';
import StaticSection from '../../../client/components/static-section';
import StandardConditions from '../components/standard-conditions';

const Modern = ({ project }) => (
  <Fragment>
    <div className="logo"></div>
    <h3 className="licence">Project licence</h3>
    <h1 className="project-title">{project.title}</h1>
    {
      Object.values(getGrantedSubsections(1)).filter(s => !s.granted.show || s.granted.show(project)).sort((a, b) => a.granted.order - b.granted.order).map((section, index) => (
        <section className={classnames('section', section.name)} key={index}>
          <StaticSection section={section} pdf />
        </section>
      ))
    }
    <StandardConditions />
  </Fragment>
)

const mapStateToProps = ({ project }) => ({ project });

export default connect(mapStateToProps)(Modern);
