import React, { Fragment } from 'react';
import { connect } from 'react-redux';

import pick from 'lodash/pick';
import pickBy from 'lodash/pickBy';
import size from 'lodash/size';
import flatten from 'lodash/flatten';

import Accordion from '../../../components/accordion';
import ExpandingPanel from '../../../components/expanding-panel';
import NewComments from '../../../components/new-comments';

import { flattenReveals } from '../../../helpers';

import Section from './section';
import Steps from './steps';
import Animals from './animals';
import LegacyAnimals from './legacy-animals';
import Conditions from '../../../components/conditions/protocol-conditions';

const getSection = (section, props) => {
  switch(section) {
    case 'steps':
      return <Steps {...props} />
    case 'animals':
      return props.schemaVersion === 0
        ? <LegacyAnimals {...props} />
        : <Animals {...props} />
    case 'conditions':
      return <Conditions
        {...props}
        type='condition'
        conditions={props.values.conditions}
      />
    case 'authorisations':
      return <Conditions
        {...props}
        type='authorisation'
        conditions={props.values.conditions}
      />
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

const getBadge = (section, newComments, values) => {
  let relevantComments;
  if (section.repeats) {
    const re = new RegExp(`^${section.repeats}\\.`);
    relevantComments = pickBy(newComments, (value, key) => key.match(re))
  } else {
    relevantComments = pick(newComments, flattenReveals(section.fields, values).map(field => field.name))
  }
  const numberOfNewComments = Object.values(relevantComments).reduce((total, comments) => total + (comments || []).length, 0);
  return numberOfNewComments
    ? (
      <Fragment>
        <NewComments comments={numberOfNewComments} />
        <br />
      </Fragment>
    )
    : null
}

const getTitle = (section, newComments, values) => (
  <Fragment>
    {
      section.fields && getBadge(section, newComments, values)
    }
    {
      section.title
    }
  </Fragment>
)

const ProtocolSections = ({ sections, protocolState, editable, newComments, ...props }) => (
  <Accordion openOne scrollToActive open={getOpenSection(protocolState, editable, sections)}>
    {
      Object.keys(sections).filter(section => !sections[section].show || sections[section].show(props)).map((section, sectionIndex) => (
        <ExpandingPanel alwaysUpdate={section === 'conditions' || section === 'authorisations'} key={section} title={getTitle(sections[section], newComments, props.values)}>
          {
            getSection(section, { ...props, protocolState, editable, ...sections[section], sectionsLength: size(sections), sectionIndex })
          }
        </ExpandingPanel>
      ))
    }
  </Accordion>
)

const mapStateToProps = ({ application: { schemaVersion, showConditions } }) => ({ schemaVersion, showConditions });

export default connect(mapStateToProps)(ProtocolSections);
