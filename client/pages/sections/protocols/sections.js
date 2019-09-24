import React, { Fragment } from 'react';
import { connect } from 'react-redux';

import pick from 'lodash/pick';
import pickBy from 'lodash/pickBy';
import size from 'lodash/size';
import flatten from 'lodash/flatten';
import isUndefined from 'lodash/isUndefined';

import Accordion from '../../../components/accordion';
import ExpandingPanel from '../../../components/expanding-panel';
import NewComments from '../../../components/new-comments';

import { flattenReveals } from '../../../helpers';

import Section from './section';
import Steps from './steps';
import Animals from './animals';
import LegacyAnimals from './legacy-animals';
import Conditions from '../../../components/conditions/protocol-conditions';
import ChangedBadge from '../../../components/changed-badge';

const getSection = (section, props) => {
  if (props.isGranted && props.granted && props.granted.review) {
    return <props.granted.review {...props} />
  }
  switch(section) {
    case 'steps':
      return props.schemaVersion === 0
        ? <Section {...props} />
        : <Steps {...props} />
    case 'animals':
      return <Animals {...props} />
    case 'legacy-animals':
      return <LegacyAnimals {...props} />
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

const getFieldKeys = (section, values) => {
  if (section.repeats) {
    return (values[section.repeats] || []).reduce((list, repeater) => {
      return list.concat((section.fields || []).map(f => `protocols.${values.id}.${section.repeats}.${repeater.id}.${f.name}`));
    }, []);
  }
  return section.fields.map(f => `protocols.${values.id}.${f.name}`);
};

const getBadges = (section, newComments, values) => {
  let relevantComments;
  if (section.repeats) {
    const re = new RegExp(`^${section.repeats}\\.`);
    relevantComments = pickBy(newComments, (value, key) => key.match(re))
  } else {
    relevantComments = pick(newComments, flattenReveals(section.fields, values).map(field => field.name))
  }
  const numberOfNewComments = Object.values(relevantComments).reduce((total, comments) => total + (comments || []).length, 0);

  const fields = getFieldKeys(section, values);

  return (
    <Fragment>
      {
        !!numberOfNewComments && <NewComments comments={numberOfNewComments} />
      }
      {
        section.fields && <ChangedBadge fields={fields} />
      }
    </Fragment>
  )
}

const getTitle = (section, newComments, values) => (
  <Fragment>
    {
      section.fields && getBadges(section, newComments, values)
    }
    <div>{ section.title }</div>
  </Fragment>
)

const sortGranted = (sections, isGranted) => (a, b) => {
  if (!isGranted || isUndefined(sections[a].granted)) {
    return false;
  }
  return sections[a].granted.order - sections[b].granted.order;
}

const ProtocolSections = ({ sections, protocolState, editable, newComments, ...props }) =>  {
  return (
  <Accordion open={getOpenSection(protocolState, editable, sections)} toggleAll={!props.pdf}>
    {
      Object.keys(sections)
        .sort(sortGranted(sections, props.isGranted))
        .filter(section => !sections[section].show || sections[section].show(props))
        .map((section, sectionIndex) => (
          <ExpandingPanel alwaysUpdate={section === 'conditions' || section === 'authorisations'} key={section} title={getTitle(sections[section], newComments, props.values)} className={section.toLowerCase()}>
            {
              getSection(section, { ...props, protocolState, editable, ...sections[section], sectionsLength: size(sections), sectionIndex })
            }
          </ExpandingPanel>
        ))
    }
  </Accordion>
)}

const mapStateToProps = ({
  application: {
    schemaVersion,
    showConditions,
    isGranted
  }
}, { sections }) => ({
  schemaVersion,
  showConditions,
  isGranted,
  // show all sections for legacy
  sections: isGranted && schemaVersion !== 0
    ? pickBy(sections, section => section.granted)
    : sections
});

export default connect(mapStateToProps)(ProtocolSections);
