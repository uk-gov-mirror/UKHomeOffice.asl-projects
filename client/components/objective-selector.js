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
      noComments={true}
    />
    <Link to="../action-plan">Manage objectives</Link>
  </div>
);

const mapStateToProps = ({ project }) => ({
  objectives: (project.objectives || []).filter(p => p.title).map(p => p.title)
});

export default connect(mapStateToProps)(ObjectiveSelector);
