import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Field from './field';

const ObjectiveSelector = ({
  objectives,
  ...props
}) => (
  <div className="objective-selector">
    <Field
      {...props}
      type="checkbox"
      className="smaller"
      options={objectives}
    />
    <Link to="../strategy">Add new objective</Link>
  </div>
);

const mapStateToProps = ({ project }) => ({
  objectives: (project.objectives || []).filter(p => p.title).map(p => p.title)
});

export default connect(mapStateToProps)(ObjectiveSelector);
