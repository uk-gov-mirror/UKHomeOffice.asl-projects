import React, { useState, Fragment } from 'react';
import { connect } from 'react-redux';
import uuid from 'uuid/v4';
import { Button } from '@ukhomeoffice/react-components';
import { updateConditions } from '../../actions/projects';
import Conditions from './conditions';
import Editable from '../editable';

function ProtocolConditions(props) {
  const [adding, setAdding] = useState(false);
  const [updating, setUpdating] = useState(false);

  const conditions = props.conditions.filter(c => c.type === props.type);

  function handleSave(val) {
    setAdding(false);
    setUpdating(true);
    props.saveConditions([
      ...conditions,
      {
        content: val,
        custom: true,
        type: props.type,
        key: uuid()
      }
    ])
      .then(() => setUpdating(false))
  }

  return (
    <Fragment>
      <p className="grey">
        {
          conditions.length
            ? `These ${props.items.toLowerCase()} only apply to this protocol.`
            : `No ${props.items.toLowerCase()} have been added`
        }
      </p>
      <Conditions
        {...props}
        updating={updating}
        conditions={conditions}
        scope="protocol"
      />
      {
        adding
          ? (
            <Editable
              onSave={handleSave}
              onCancel={setAdding.bind(null, false)}
            />
          )
          : <Button
            className="button-secondary"
            onClick={setAdding.bind(null, true)}
          >
            {
              conditions.length
                ? `Add another ${props.singular.toLowerCase()}`
                : `Add ${props.singular.toLowerCase()}`
            }
          </Button>
      }
    </Fragment>
  )
}

export default connect(null, (dispatch, { type, values: { id } }) => ({
  saveConditions: conditions => dispatch(updateConditions(type, conditions, id))
}))(ProtocolConditions);
