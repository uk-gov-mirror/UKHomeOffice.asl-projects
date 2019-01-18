import React from 'react';
import { connectProject } from '../../../helpers';
import map from 'lodash/map';
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

const ProtocolSections = ({ sections, ...props }) => (
  <Accordion openOne>
    {
      map(pickBy(sections, section => sectionIncluded(section, props.project)), (section, name) => (
        <ExpandingPanel key={name} title={section.title}>
          {
            getSection(name, { ...props, ...section })
          }
        </ExpandingPanel>
      ))
    }
  </Accordion>
);

export default connectProject(ProtocolSections);
