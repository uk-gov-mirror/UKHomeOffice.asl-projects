import React, { Fragment, useState, useEffect } from 'react';
import { TextArea, Button } from '@ukhomeoffice/react-components';
import Reminders from './reminders';

function Editable({ edited,
  updating,
  showRevert,
  conditionKey,
  reminders = [],
  content,
  onChange = () => {},
  allowEmpty,
  onSave = () => {},
  onCancel = () => {},
  onRevert = () => {} }) {

  const [ state, setState ] = useState({content, reminders});

  useEffect(() => {
    onChange(state);
  }, [state]);

  const onContentChange = e => {
    const content = e.target.value;
    setState({ ...state, content });
  };

  const onRemindersChange = reminders => {
    setState({ ...state, reminders });
  };

  const save = e => {
    e.preventDefault();
    if ((!!state.content && state.content !== '') || allowEmpty) {
      onSave(state);
    } else {
      window.alert('Condition/authorisation cannot be empty');
    }
  };

  const cancel = e => {
    e.preventDefault();
    if (state.content !== content) {
      if (window.confirm('Are you sure')) {
        onCancel();
      }
    } else {
      onCancel();
    }
  };

  const revert = e => {
    e.preventDefault();
    if (window.confirm('Are you sure?')) {
      onRevert();
    }
  };

  return (
    <Fragment>
      <TextArea
        name="content"
        label=""
        value={content}
        onChange={onContentChange}
        autoExpand={true}
      />

      {
        conditionKey &&
        <Reminders values={reminders} conditionKey={conditionKey} onChange={onRemindersChange} />
      }

      <p className="control-panel">
        <Button disabled={updating} onClick={save} className="button-secondary">Save</Button>
        <Button disabled={updating} onClick={cancel} className="link">Cancel</Button>
        {
          edited && showRevert && <Button disabled={updating} onClick={revert} className="link">Revert to default</Button>
        }
      </p>
    </Fragment>
  );
}

export default Editable;
