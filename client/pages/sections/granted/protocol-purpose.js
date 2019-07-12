import React from 'react';
import { connect } from 'react-redux';
import get from 'lodash/get';
import ReviewFields from '../../../components/review-fields';
import { getSubsections } from '../../../schema';

const Purpose = ({ values, schemaVersion }) => {
  const fields = get(getSubsections(schemaVersion), 'protocols.sections.details.fields');
  const included = ['description', 'outputs'];
  return (
    <ReviewFields
      fields={fields.filter(f => included.includes(f.name))}
      values={values}
    />
  );
};

export default connect(({ application: { schemaVersion } }) => ({ schemaVersion }))(Purpose);
