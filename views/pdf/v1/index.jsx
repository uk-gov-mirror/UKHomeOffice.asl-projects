import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import map from 'lodash/map';
import schema from '../../../client/schema/v1';
import StaticSection from '../../../client/components/static-section';

const Modern = ({ project }) => (
  <Fragment>
    {
      Object.values(schema).map((section, index) => (
        <section className="section" key={index}>
          <h1>{section.title}</h1>
          {
            map(section.subsections, (subsection) => (
              <StaticSection section={subsection} subsection={true} />
            ))
          }
        </section>
      ))
    }
  </Fragment>
)

const mapStateToProps = ({ project }) => ({ project });

export default connect(mapStateToProps)(Modern);
