import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Field from './field';
import getLocations from '../helpers/get-locations';

const LocationSelector = (props) => {
  const project = useSelector(state => state.project);
  const { establishment } = useSelector(state => state.application);
  const locations = getLocations(project, establishment);

  return (
    <div className="location-selector">
      <Field
        {...props}
        type="checkbox"
        className="smaller"
        options={locations}
        noComments={true}
      />
      <Link to="../establishments">Manage establishments</Link>
      <Link to="../poles">Manage POLEs</Link>
    </div>
  );
};

export default LocationSelector;
