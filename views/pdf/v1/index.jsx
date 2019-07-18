import React, { Fragment } from 'react';
import ReactMarkdown from 'react-markdown';
import { connect } from 'react-redux';
import map from 'lodash/map';
import { getGrantedSubsections } from '../../../client/schema';
import StaticSection from '../../../client/components/static-section';
import STANDARD_CONDITIONS from '../../../client/constants/standard-conditions';

const Modern = ({ project }) => (
  <Fragment>
    <div className="logo"></div>
    <h3 className="licence">Project licence</h3>
    <h1 className="project-title">{project.title}</h1>
    {
      Object.values(getGrantedSubsections(1)).filter(s => !s.granted.show || s.granted.show(project)).sort((a, b) => a.granted.order - b.granted.order).map((section, index) => (
        <section className="section" key={index}>
          <StaticSection section={section} pdf />
        </section>
      ))
    }
    <section className="section standard-conditions">
      <h2>Standard conditions</h2>
      <ol>
        {
          STANDARD_CONDITIONS.map(condition => (
            <li>
              <div className="purple-inset">
                <ReactMarkdown>{condition}</ReactMarkdown>
              </div>
            </li>
          ))
        }
      </ol>
    </section>
  </Fragment>
)

const mapStateToProps = ({ project }) => ({ project });

export default connect(mapStateToProps)(Modern);
