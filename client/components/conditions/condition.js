import React, { useState } from 'react';
import classnames from 'classnames';
import ReactMarkdown from 'react-markdown';
import Editable from '../editable';
import Playback from '../playback';

const Condition = ({
  editing: isEditing = false,
  content,
  title,
  id,
  playback,
  updating,
  onUpdate,
  onChange = () => {},
  revert,
  edited,
  editable = true,
  expandable = true,
  className
}) => {
  const [editing, setEditing] = useState(isEditing);
  const [expanded, setExpanded] = useState(expandable === false);

  function edit(e) {
    e.preventDefault();
    setEditing(true);
  }

  function handleCancel() {
    setEditing(false);
  }

  function handleRevert() {
    setEditing(false);
    revert()
  }

  function handleUpdate(val) {
    setEditing(false);
    onUpdate(val);
  }

  function handleChange(val) {
    onChange(val);
  }

  function toggleExpanded(e) {
    e.preventDefault();
    setExpanded(!expanded);
  }

  return (
    <div className={classnames('add-condition', className)}>
      <h3>{title}</h3>
      {
        editing && editable
          ? (
            <Editable
              content={content}
              edited={edited}
              updating={updating}
              onSave={handleUpdate}
              onCancel={handleCancel}
              onRevert={handleRevert}
              onChange={handleChange}
              showRevert={true}
            />
          )
          : (
            <>
              {
                content && content !== ''
                  ? <ReactMarkdown id={id} className={classnames('light', { clamp: expandable && !expanded })}>{content}</ReactMarkdown>
                  : <em>No answer provided</em>
              }
              {
                playback && <Playback field={playback} />
              }
              {
                (editable || expandable) && (
                  <p className="light">
                    {
                      expandable && <a href="#" className="expand" aria-controls={id} aria-expanded={expanded} onClick={toggleExpanded}>{ expanded ? 'Collapse' : 'Expand' }</a>
                    }
                    {
                      editable && expandable && <span> | </span>
                    }
                    {
                      editable && <a href="#" onClick={edit}>Edit</a>
                    }
                  </p>
                )
              }
            </>
          )
      }
    </div>
  )
}

export default Condition
