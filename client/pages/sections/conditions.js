import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { updateConditions } from '../../actions/projects';
import Conditions from '../../components/conditions';

const ConditionsPage = ({ values, saveConditions }) => (
  <Fragment>
    <Conditions
      saveConditions={saveConditions}
      type="project"
      conditions={values.conditions}
    />
  </Fragment>
)

const mapDispatchToProps = dispatch => {
  return {
    saveConditions: conditions => dispatch(updateConditions(conditions))
  }
}

export default connect(null, mapDispatchToProps)(ConditionsPage);
