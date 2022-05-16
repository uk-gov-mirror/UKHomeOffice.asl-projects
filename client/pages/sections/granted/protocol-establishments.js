import React from 'react';
import { useSelector } from 'react-redux';
import get from 'lodash/get';
import ReviewFields from '../../../components/review-fields';
import { getSubsections } from '../../../schema';
import getLocations from '../../../helpers/get-locations';

const Locations = ({ values }) => {
  const { project, establishment, schemaVersion } = useSelector(state => state.application);
  const fields = get(getSubsections(schemaVersion), 'protocols.sections.details.fields');

  // older project transfers did not remove the previous primary establishment from the protocol locations
  const projectLocations = getLocations(project, establishment);
  values.locations = values.locations.filter(location => projectLocations.includes(location));

  return (
    <div className="locations">
      <ReviewFields
        fields={fields.filter(f => f.name === 'locations')}
        values={values}
        />
    </div>
  );
};

export default Locations;
