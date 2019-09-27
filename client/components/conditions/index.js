import React, { useState, Fragment } from 'react';
import { connect } from 'react-redux';
import ReactMarkdown from 'react-markdown';
import { Button } from '@ukhomeoffice/react-components';
import { updateConditions } from '../../actions/projects';
import Conditions from './conditions';
import AddConditions from './add-conditions';
import RetrospectiveAssessment from '../retrospective-assessment';

function ConditionsPage({
  values,
  type,
  intro,
  emptyIntro,
  emptyIntroReadOnly,
  showConditions,
  editConditions,
  showRA,
  ...props
}) {
  if (!showConditions) {
    return null;
  }
  const [adding, setAdding] = useState(false);
  const conditions = (values.conditions || []).filter(condition => condition.type === type);

  function save(vals) {
    setAdding(false);
    props.saveConditions([ ...conditions, ...vals ]);
  }

  function cancel() {
    setAdding(false);
  }

  return (
    <Fragment>
      {
        editConditions && <ReactMarkdown className="grey">{conditions.length ? intro : emptyIntro}</ReactMarkdown>
      }
      {
        !editConditions && !conditions.length && <ReactMarkdown className="grey">{emptyIntroReadOnly}</ReactMarkdown>
      }
      {
        showRA && (
          <Fragment>
            <h2>Additional condition 1</h2>
            <RetrospectiveAssessment />
          </Fragment>
        )
      }
      <Conditions
        scope="project"
        type={type}
        conditions={conditions}
        startIndex={showRA ? 1 : 0}
        {...props}
      />
      {
        editConditions && (
          <Fragment>
            {
              adding
                ? <AddConditions
                  type={type}
                  onCancel={cancel}
                  onSave={save}
                  omit={conditions.map(c => c.key)}
                  {...props}
                />
                : <Button className="button-secondary" onClick={() => setAdding(!adding)}>Add more {props.title.toLowerCase()}</Button>
            }
          </Fragment>
        )
      }
    </Fragment>
  );
}

export default connect(({ application: { showConditions, editConditions } }) => ({ showConditions, editConditions }), (dispatch, { type }) => ({
  saveConditions: conditions => dispatch(updateConditions(type, conditions))
}))(ConditionsPage);
