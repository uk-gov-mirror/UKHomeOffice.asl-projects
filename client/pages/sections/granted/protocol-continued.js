import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import get from 'lodash/get';
import ReviewFields from '../../../components/review-fields';
import { getSubsections } from '../../../schema';

const Continued = ({ values, schemaVersion }) => {
  const fields = get(getSubsections(schemaVersion), 'protocols.sections.animals.fields');
  return (
    <Fragment>
      {
        (values.speciesDetails || []).map((s, i) => (
          <Fragment key={i}>
            <h2>{s.name}</h2>
            <h2>Continued use</h2>
            <ReviewFields
              fields={fields.filter(f => f.name === 'continued-use')}
              values={s['continued-use']}
            />
            <h2>Re-use</h2>
            <ReviewFields
              fields={fields.filter(f => f.name === 'reuse')}
              values={s.reuse}
            />
          </Fragment>
        ))
      }
    </Fragment>
  )
}

export default connect(({ application: { schemaVersion } }) => ({ schemaVersion }))(Continued);
