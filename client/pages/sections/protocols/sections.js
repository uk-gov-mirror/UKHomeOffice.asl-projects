import React from 'react';
import { connect } from 'react-redux';

import size from 'lodash/size'
import pickBy from 'lodash/pickBy';
import every from 'lodash/every';

import Accordion from '../../../components/accordion';
import ExpandingPanel from '../../../components/expanding-panel';

import Section from './section';
import Steps from './steps';
import Animals from './animals';

const getSection = (section, props) => {
  switch(section) {
    case 'steps':
      return <Steps {...props} />
    case 'animals':
      return <Animals {...props} />
    case 'experience':
      return <Section { ...props } sections={{ typical: props.typical, maximal: props.maximal }} />
    default:
      return <Section {...props} />
  }
}

const sectionIncluded = (section, values) => {
  if (!section.conditional) {
    return true;
  }
  return every(Object.keys(section.conditional), key => section.conditional[key] === values[key]);
}

const ProtocolSections = ({ sections, ...props }) => {
  sections = pickBy(sections, section => sectionIncluded(section, props.project));

  return (
    <Accordion openOne scrollToActive>
      {
        Object.keys(sections).map((section, sectionIndex) => (
          <ExpandingPanel key={section} title={sections[section].title}>
            {
              getSection(section, { ...props, ...sections[section], sectionsLength: size(sections), sectionIndex })
            }
          </ExpandingPanel>
        ))
      }
    </Accordion>
  )

};

const mapStateToProps = ({ project }) => ({ project });

export default connect(mapStateToProps)(ProtocolSections);
