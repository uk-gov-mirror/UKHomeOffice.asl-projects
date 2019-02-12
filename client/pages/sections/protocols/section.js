import React, { Fragment } from 'react';
import { connect } from 'react-redux';

import { Button } from '@ukhomeoffice/react-components';

import flatten from 'lodash/flatten';
import map from 'lodash/map';

import Fieldset from '../../../components/fieldset'

const RenderSection = ({ title, label, hideTitle = true, fields, values, prefix, onFieldChange }) => {
  return (
    <Fragment>
      {
        title && !hideTitle && <h3>{title}</h3>
      }
      {
        label && <h4>{label}</h4>
      }
      <Fieldset
        fields={fields}
        values={values}
        prefix={prefix}
        onFieldChange={onFieldChange}
      />
    </Fragment>
  )
}

const Section = ({
  index,
  name,
  values,
  sections,
  advance,
  hideTitle,
  prefix = '',
  sectionsLength,
  sectionIndex,
  ...props
}) => {
  const fields = sections
    ? flatten(map(sections, section => section.fields))
    : props.fields;

  prefix = `${prefix}${name}-${index}-`;

  return (
    <Fragment>
      {
        sections
          ? Object.keys(sections).map(section => <RenderSection key={section} {...props} {...sections[section]} prefix={prefix} values={values} hideTitle={false} />)
          : <RenderSection {...props} hideTitle={hideTitle} fields={fields} prefix={prefix} values={values} />
      }
      {
        sectionIndex + 1 < sectionsLength && <Button className="button-secondary" onClick={advance}>Next section</Button>
      }
    </Fragment>
  );
}

const mapStateToProps = ({ project }, { index }) => {
  return {
    values: project.protocols[index]
  };
};

export default connect(mapStateToProps)(Section);
