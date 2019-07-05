import React, { useState } from 'react';
import { connect } from 'react-redux';
import ReactMarkdown from 'react-markdown';
import { Button } from '@ukhomeoffice/react-components';
import { updateConditions } from '../../actions/projects';
import Conditions from './conditions';
import AddConditions from './add-conditions';

const ConditionsPage = ({
  values,
  type,
  intro,
  emptyIntro,
  emptyIntroReadOnly,
  showConditions,
  editConditions,
  ...props
}) => {
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
    <>
      {
        editConditions && <ReactMarkdown className="grey">{conditions.length ? intro : emptyIntro}</ReactMarkdown>
      }
      {
        !editConditions && !conditions.length && <ReactMarkdown className="grey">{emptyIntroReadOnly}</ReactMarkdown>
      }
      <Conditions
        scope="project"
        type={type}
        conditions={conditions}
        {...props}
      />
      {
        editConditions && (
          <>
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
          </>
        )
      }
    </>
  )
}

export default connect(({ application: { showConditions, editConditions } }) => ({ showConditions, editConditions }), (dispatch, { type }) => ({
  saveConditions: conditions => dispatch(updateConditions(type, conditions))
}))(ConditionsPage);
