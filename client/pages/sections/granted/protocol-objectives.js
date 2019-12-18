import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import get from 'lodash/get';
import { getSubsections } from '../../../schema';

const Objectives = ({ values, schemaVersion }) => {
  const field = get(getSubsections(schemaVersion), 'protocols.sections.details.fields').find(f => f.name === 'objectives');
  return (
    <div className="objectives">
      <h2>Objectives</h2>
      <h3>{ field.label }</h3>
      {
        (values.objectives || []).map((objective, index) => (
          <Fragment key={index}>
            <h3>Objective {index + 1}</h3>
            <p>{ objective }</p>
          </Fragment>
        ))
      }
    </div>
  );
};

export default connect(({ application: { schemaVersion } }) => ({ schemaVersion }))(Objectives);
