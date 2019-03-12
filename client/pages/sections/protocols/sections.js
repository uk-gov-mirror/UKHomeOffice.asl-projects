import React from 'react';

import size from 'lodash/size'
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
    default:
      return <Section {...props} />
  }
}

const ProtocolSections = ({ sections, ...props }) => (
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

export default ProtocolSections;
