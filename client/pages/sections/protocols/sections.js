import React from 'react';
import { connect } from 'react-redux';

import size from 'lodash/size';
import flatten from 'lodash/flatten';
import Accordion from '../../../components/accordion';
import ExpandingPanel from '../../../components/expanding-panel';

import Section from './section';
import Steps from './steps';
import Animals from './animals';
import LegacyAnimals from './legacy-animals';

const getSection = (section, props) => {
  switch(section) {
    case 'steps':
      return <Steps {...props} />
    case 'animals':
      return props.schemaVersion === 0
        ? <LegacyAnimals {...props} />
        : <Animals {...props} />
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

const getOpenSection = (protocolState, editable, sections) => {
  if (!editable) {
    return null;
  }

  if (!protocolState) {
    return 0;
  }

  const { fieldName } = protocolState;

  return Object.values(sections).findIndex(section => {
    return getFields(section.fields).map(field => field.name).includes(fieldName);
  });
}

const ProtocolSections = ({ sections, protocolState, editable, ...props }) => (
  <Accordion openOne scrollToActive open={getOpenSection(protocolState, editable, sections)}>
    {
      Object.keys(sections).map((section, sectionIndex) => (
        <ExpandingPanel key={section} title={sections[section].title}>
          {
            getSection(section, { ...props, protocolState, editable, ...sections[section], sectionsLength: size(sections), sectionIndex })
          }
        </ExpandingPanel>
      ))
    }
  </Accordion>
)

const mapStateToProps = ({ application: { schemaVersion } }) => ({ schemaVersion })

export default connect(mapStateToProps)(ProtocolSections);
