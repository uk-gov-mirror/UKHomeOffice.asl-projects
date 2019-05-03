import sendMessage from './messaging';
import { throwError } from './messages';

import { ADD_COMMENT, DELETE_COMMENT } from './types';

export const commentAdded = ({ comment, author, field, id }) => {
  return {
    type: ADD_COMMENT,
    comment,
    author,
    field,
    id
  }
};

const commentDeleted = ({ id, field }) => ({
  type: DELETE_COMMENT,
  id,
  field
});

export const addComment = comment => (dispatch, getState) => {
  const state = getState();
  const params = {
    url: `${state.application.basename.replace(/\/edit?/, '')}/comment`,
    method: 'POST',
    data: comment
  }
  return Promise.resolve()
    .then(() => sendMessage(params))
    .then(({ id }) => {
      dispatch(commentAdded({ ...comment, id, author: state.application.user }));
    })
    .catch(err => {
      console.error(err);
      dispatch(throwError('Error posting comment'));
    });
}

export const deleteComment = ({ id, field }) => (dispatch, getState) => {
  const state = getState();
  const params = {
    url: `${state.application.basename.replace(/\/edit?/, '')}/comment/${id}`,
    method: 'DELETE'
  };
  return Promise.resolve()
    .then(() => sendMessage(params))
    .then(() => dispatch(commentDeleted({ id, field })))
    .catch(err => {
      console.error(err);
      dispatch(throwError('Error deleting comment'));
    });
}
