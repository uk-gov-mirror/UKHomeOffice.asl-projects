import React, { useState, useReducer, Fragment } from 'react';
import { Button } from '@ukhomeoffice/react-components';
import Condition from './condition';
import Field from '../field';
import { v4 as uuid } from 'uuid';
import CONDITIONS from '../../constants/conditions';

function CustomConditions({ conditions, onUpdate, onAdd, onRemove }) {
  const handleOnUpdate = index => val => onUpdate(index, val);

  return (
    <Fragment>
      {
        conditions.map((condition, index) => (
          <Fragment key={index}>
            {
              index > 0 && (
                <p>
                  <Button className="link" onClick={() => onRemove(index - 1)}>Discard</Button>
                </p>
              )
            }
            <Condition
              editing={true}
              onUpdate={handleOnUpdate(index)}
              onChange={handleOnUpdate(index)}
              content={condition}
            />
        </Fragment>
        ))
      }
      <p>
        <Button className="link" onClick={onAdd}>Create another</Button>
      </p>
    </Fragment>
  );
}

const getConditions = (type, omit = []) => {
  return Object.keys(CONDITIONS.inspector)
    .filter(key => CONDITIONS.inspector[key].type === type)
    .filter(key => !omit.includes(key))
    .map(key => ({
      key,
      type,
      checked: false,
      inspectorAdded: true,
      ...CONDITIONS.inspector[key].versions[CONDITIONS.inspector[key].versions.length - 1]
    }));
}

const initialState = [''];

function customConditionReducer(state, action) {
  switch (action.type) {
    case 'add':
      return [ ...state, '' ];
    case 'update':
      return state.map((item, index) => index === action.index ? action.val : item);
    case 'remove':
      return state.filter((item, index) => index !== action.index);
    default:
      throw new Error();
  }
}

function AddConditions({
  title,
  type,
  onSave,
  onCancel,
  omit,
  singular,
  isLegacy,
  controls,
  conditions: c,
  showTitle = true,
  onFieldChange = () => {}
}) {
  const [conditions, setConditions] = useState(isLegacy ? c : getConditions(type, omit));
  const [customActive, setCustomActive] = useState(false);
  const [customConditions, dispatch] = useReducer(customConditionReducer, initialState);

  const setEdited = key => edited => {
    edited = (typeof edited === 'object' && edited.content) ? edited.content : edited;
    setConditions(conditions.map(c => c.key === key ? ({ ...c, edited }) : c));
  }

  const revert = key => () => setEdited(key)(null);

  const options = conditions.map(condition => {
    return {
      value: condition.key,
      label: <Condition
        title={condition.title}
        content={condition.edited || condition.content}
        edited={!!condition.edited}
        onUpdate={setEdited(condition.key)}
        revert={revert(condition.key)}
        id={condition.key}
        expandable={!isLegacy}
        editable={!isLegacy}
      />
    }
  });

  const handleOnAdd = () => dispatch({ type: 'add' });
  const handleOnUpdate = (index, val) => dispatch({ type: 'update', index, val });
  const handleOnRemove = index => dispatch({ type: 'remove', index });

  if (!isLegacy) {
    options.push({
      label: `Create your own ${singular.toLowerCase()}`,
      value: 'custom',
      reveal: {
        component: <CustomConditions
          conditions={customConditions}
          onAdd={handleOnAdd}
          onUpdate={handleOnUpdate}
          onRemove={handleOnRemove}
        />
      }
    })
  }

  function onChange(vals) {
    setConditions(
      conditions.map(c => vals.includes(c.key) ? { ...c, checked: true } : { ...c, checked: false })
    );
    onFieldChange(vals);
    setCustomActive(vals.includes('custom'));
  }

  function save() {
    onSave([
      ...conditions.filter(c => c.checked),
      ...customConditions.filter(c => !!c && c !== '').map(condition => ({
        type,
        key: uuid(),
        custom: true,
        content: condition
      }))
    ]);
  }

  return (
    <Fragment>
      {
        showTitle && <h2>{title}</h2>
      }
      <Field
        type="checkbox"
        className="smaller"
        name="conditions"
        options={options}
        value={[
          ...conditions.filter(c => c.checked).map(c => c.key),
          ...(customActive ? ['custom'] : [])
        ]}
        onChange={onChange}
        noComments
      />
      {
        controls !== false && (
          <p className="control-panel">
            <Button onClick={save} className="button-secondary">Confirm</Button>
            <Button onClick={onCancel} className="link">Cancel</Button>
          </p>
        )
      }
    </Fragment>
  );
}

export default AddConditions;
