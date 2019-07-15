import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { updateConditions, updateRetrospectiveAssessment } from '../../actions/projects';
import AddConditions from '../../components/conditions/add-conditions';
import Condition from '../../components/conditions/condition';
import Fieldset from '../../components/fieldset';
import ReviewFields from '../../components/review-fields';
import LEGACY_CONDITIONS from '../../constants/legacy-conditions';

function LegacyConditions({
  fields,
  values,
  customTitle,
  saveRetrospectiveAssessment,
  showConditions,
  editConditions,
  ...props
}) {
  if (!showConditions) {
    return null;
  }
  const conditions = Object.keys(LEGACY_CONDITIONS).map(key => ({
    key,
    checked: !!(values.conditions || []).find(c => c.key === key),
    ...LEGACY_CONDITIONS[key]
  }));
  const custom = (values.conditions || []).find(value => value.key === 'custom');

  function handleConditionsChange(vals) {
    props.saveConditions([
      ...(custom ? [custom] : []),
      ...conditions.filter(c => vals.includes(c.key))
    ])
  }

  function updateCustom(content) {
    props.saveConditions([
      ...conditions,
      { key: 'custom', content }
    ]);
  }

  function saveRetro(key, data) {
    saveRetrospectiveAssessment({
      ...values.retrospectiveAssessment,
      [key]: data
    })
  }

  return (
    <Fragment>
      {
        editConditions
          ? (
            <Fragment>
              <AddConditions
                {...props}
                controls={false}
                conditions={conditions}
                onFieldChange={handleConditionsChange}
              />
              <div className="govuk-form-group">
                <Condition
                  title={<h3>{customTitle}</h3>}
                  onUpdate={updateCustom}
                  content={custom && custom.content}
                  editable={true}
                  expandable={false}
                  allowEmpty
                />
              </div>
              <h2>Retrospective assessment</h2>
              <Fieldset
                fields={fields}
                values={values.retrospectiveAssessment || {}}
                onFieldChange={saveRetro}
                noComments
              />
          </Fragment>
          )
          : (
            <Fragment>
              {
                (values.conditions || []).filter(c => c.key !== 'custom').map(condition => {
                  const content = LEGACY_CONDITIONS[condition.key];
                  return (
                    <Condition
                      className="purple-inset"
                      key={condition.key}
                      {...content}
                      editable={false}
                      expandable={false}
                    />
                  )
                })
              }
              <Condition
                className="purple-inset"
                title={customTitle}
                content={(custom || {}).content}
                editable={false}
                expandable={false}
              />
              <h2>Retrospective assessment</h2>
              <ReviewFields
                fields={fields}
                values={values.retrospectiveAssessment || {}}
                noComments
              />
          </Fragment>
          )
      }
    </Fragment>
  )
}

export default connect(
  ({ application: { schemaVersion, showConditions, editConditions } }) => ({ isLegacy: schemaVersion === 0, showConditions, editConditions }),
  dispatch => ({
    saveRetrospectiveAssessment: retrospectiveAssessment => dispatch(updateRetrospectiveAssessment(retrospectiveAssessment)),
    saveConditions: conditions => dispatch(updateConditions('legacy', conditions))
  })
)(LegacyConditions);
