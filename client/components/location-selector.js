import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import Field from './field';
import getLocations from '../helpers/get-locations';

const LocationSelector = ({
  locations,
  ...props
}) => (
  <div className="location-selector">
    <Field
      {...props}
      type="checkbox"
      className="smaller"
      options={locations}
      noComments={true}
    />
    <Link to="../establishments">Add new establishment</Link>
    <Link to="../poles">Add new POLE</Link>
  </div>
)

const mapStateToProps = ({ project, application: { establishment } }) => ({
  locations: getLocations(project, establishment)
});

export default connect(mapStateToProps)(LocationSelector);
