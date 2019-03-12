import React from 'react';
import { connect } from 'react-redux';

import map from 'lodash/map';
import size from 'lodash/size';
import get from 'lodash/get';
import flatten from 'lodash/flatten';
import castArray from 'lodash/castArray';
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

const getFields = fields => {
  return flatten(fields.map(field => {
    const reveals = field.options && field.options.map(opt => opt.reveal).filter(Boolean);
    if (!reveals) {
      return field
    }
    return [field, ...flatten(reveals)];
  }));
};

const getOpenSection = (parts, editable, sections) => {
  if (!editable) {
    return null;
  }

  if (!parts) {
    return 0;
  }

  const fieldName = parts[parts.length - 1];

  return Object.values(sections).findIndex(section => {
    return getFields(section.fields).map(field => field.name).includes(fieldName);
  });
}

const ProtocolSections = ({ sections, parts, editable, ...props }) => (
  <Accordion openOne scrollToActive open={getOpenSection(parts, editable, sections)}>
    {
      Object.keys(sections).map((section, sectionIndex) => (
        <ExpandingPanel key={section} title={sections[section].title}>
          {
            getSection(section, { ...props, parts, editable, ...sections[section], sectionsLength: size(sections), sectionIndex })
          }
        </ExpandingPanel>
      ))
    }
  </Accordion>
)

export default ProtocolSections
