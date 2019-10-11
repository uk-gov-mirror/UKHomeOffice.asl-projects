import React, { useState, Fragment } from 'react';
import { useDispatch } from 'react-redux';
import { Button, TextArea } from '@ukhomeoffice/react-components';
import { editComment } from '../../actions/comments';

const EditComment = ({commentToEdit, field, cancel}) => {
  const [comment, setComment] = useState(commentToEdit);
  const dispatch = useDispatch();

  const onChange = e => {
    setComment({
      ...comment,
      comment: e.target.value
    });
  }

  const onSubmit = () => {
    dispatch(
      editComment({
        field: field,
        comment: comment.comment,
        id: comment.id
      })
    ).then(() => {
      setComment(null);
      cancel();
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
        <Button className="link" onClick={cancel}>Discard changes</Button>
      </p>
    </Fragment>
  );
}

export default EditComment;
