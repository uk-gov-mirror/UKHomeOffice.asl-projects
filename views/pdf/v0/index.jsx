import React from 'react';
import classnames from 'classnames';
import { connect } from 'react-redux';
import ReactMarkdown from 'react-markdown';
import { getSubsections } from '../../../client/schema';
import StaticSection from '../../../client/components/static-section';
import RA from '../../../client/components/retrospective-assessment';
import StandardConditions from '../components/standard-conditions';
import LEGAL from '../../../client/constants/legal';

const Legacy = ({ project, values }) => {
  const sections = getSubsections(0);
  const raFields = sections['additional-conditions'].fields;

  return (
    <div className="legacy-pdf">
      <div className="logo"></div>
      <h3 className="licence">Project licence</h3>
      <h1 className="project-title">{project.title}</h1>
      <div className="granted-section">
        <h2>Project licence holder</h2>
        <p className="licence-holder">{`${project.licenceHolder.firstName} ${project.licenceHolder.lastName}`}</p>
        <ReactMarkdown className="legal">{LEGAL.licenceHolder}</ReactMarkdown>
      </div>
      <div className="granted-section">
        <h2>Granted authority</h2>
        <ReactMarkdown className="legal">{LEGAL.grantedAuthority(project.licenceNumber)}</ReactMarkdown>
      </div>
      <div className="granted-section">
        <h2>Retrospective assessment</h2>
        <RA showTitle={false} />
      </div>
      {
        Object.keys(sections).map((key, index) => {
          const section = sections[key];
          return (
            <section className={classnames('section', key)} key={index}>
              <StaticSection section={section} pdf />
            </section>
          )
        })
      }
      <StandardConditions />
    </div>
  )
}

export default connect(({
  project: values,
  application: { project, establishment }
}) => ({
  project,
  values,
  establishment
}))(Legacy);
