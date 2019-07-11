import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import Field from './field';

const LocationSelector = ({
  establishments,
  poles,
  ...props
}) => (
  <div className="location-selector">
    <Field
      {...props}
      type="checkbox"
      className="smaller"
      options={[
        ...establishments,
        ...poles
      ]}
      noComments={true}
    />
    <Link to="../establishments">Add new establishment</Link>
    <Link to="../poles">Add new POLE</Link>
  </div>
)

const mapStateToProps = ({ project }) => ({
  establishments: (project.establishments || []).filter(e => e['establishment-name']).map(e => e['establishment-name']),
  poles: (project.polesList || []).filter(p => p.title).map(p => p.title)
});

export default connect(mapStateToProps)(LocationSelector);
