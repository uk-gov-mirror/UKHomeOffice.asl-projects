import React, { Component, Fragment } from 'react';
import map from 'lodash/map';

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

const ProtocolSections = ({ sections, ...props }) => (
  <Accordion openOne>
    {
      map(sections, (section, name) => (
        <ExpandingPanel key={name} title={section.title}>
          {
            getSection(name, { ...props, ...section })
          }
        </ExpandingPanel>
      ))
    }
  </Accordion>
);

export default ProtocolSections;
