import React, { useState, Fragment } from 'react';
import { Button, TextArea } from '@ukhomeoffice/react-components'

const EditComment = ({commentToEdit, field, submitEdit, cancelEdit}) => {
  const [comment, setComment] = useState(commentToEdit);

  const onChange = e => {
    setComment({
      ...comment,
      comment: e.target.value
    });
  }

  const onSubmit = () => {
    submitEdit({
      field: field,
      comment: comment.comment,
      id: comment.id
    })
      .then(() => {
        setComment(null);
        cancelEdit();
      });
  }

  if (!comment) {
    return null;
  }

  return (
    <Fragment>
      <TextArea
        label="Edit comment"
        value={comment.comment}
        onChange={onChange}
        autoExpand={true}
        name={`edit-comment-${comment.id}`}
        autoFocus
      />
      <p className="control-panel">
        <Button onClick={onSubmit}>Save</Button>
        <Button className="link" onClick={cancelEdit}>Discard changes</Button>
      </p>
    </Fragment>
  );
}

export default EditComment;
