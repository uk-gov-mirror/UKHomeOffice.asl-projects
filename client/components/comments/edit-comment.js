import React, { useState, Fragment } from 'react';
import { useDispatch } from 'react-redux';
import { Button, TextArea } from '@ukhomeoffice/react-components';
import { editComment } from '../../actions/comments';

const EditComment = ({id, value, field, cancel}) => {
  const [comment, setComment] = useState(value);
  const dispatch = useDispatch();

  const onChange = e => {
    setComment(e.target.value);
  };

  const onSubmit = () => {
    dispatch(
      editComment({ id, comment, field })
    ).then(() => {
      setComment('');
      cancel();
    });
  };

  if (!comment) {
    return null;
  }

  return (
    <Fragment>
      <TextArea
        label="Edit comment"
        value={comment}
        onChange={onChange}
        autoExpand={true}
        name={`edit-comment-${id}`}
        autoFocus
      />
      <p className="control-panel">
        <Button onClick={onSubmit}>Save</Button>
        <Button className="link" onClick={cancel}>Discard changes</Button>
      </p>
    </Fragment>
  );
};

export default EditComment;
