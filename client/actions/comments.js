import sendMessage from './messaging';
import { throwError } from './messages';

import { COMMENT_ADDED, COMMENT_EDITED, COMMENT_DELETED, REFRESH_COMMENTS } from './types';

export const commentAdded = ({ comment, author, field, id }) => {
  return {
    type: COMMENT_ADDED,
    comment,
    author,
    field,
    id
  };
};

export const commentEdited = ({ comment, field, id }) => {
  return {
    type: COMMENT_EDITED,
    comment,
    field,
    id
  };
};

const commentDeleted = ({ id, field }) => ({
  type: COMMENT_DELETED,
  id,
  field
});

const refreshComments = comments => {
  return {
    type: REFRESH_COMMENTS,
    comments
  };
};

const getUrl = (state, suffix) => {
  const url = state.application.basename.replace(/\/edit?/, '').replace(/\/full-application?/, '');
  return `${url}${suffix}`;
};

export const addComment = comment => (dispatch, getState) => {
  const state = getState();
  const params = {
    url: getUrl(state, `/comment`),
    method: 'POST',
    data: comment
  };
  return Promise.resolve()
    .then(() => sendMessage(params))
    .then(({ id }) => {
      dispatch(commentAdded({ ...comment, id, author: state.application.user }));
    })
    .catch(err => {
      console.error(err);
      dispatch(throwError('Error posting comment'));
    });
};

export const editComment = ({ id, field, comment }) => (dispatch, getState) => {
  const state = getState();
  const params = {
    url: getUrl(state, `/comment/${id}`),
    method: 'PUT',
    data: {
      id,
      field,
      comment
    }
  };

  return Promise.resolve()
    .then(() => dispatch(commentEdited({ field, comment, id })))
    .then(() => sendMessage(params))
    .then(comments => dispatch(refreshComments(comments)))
    .catch(err => {
      console.error(err);
      dispatch(throwError('Error updating comment'));
    });
};

export const deleteComment = ({ id, field }) => (dispatch, getState) => {
  const state = getState();
  const params = {
    url: getUrl(state, `/comment/${id}`),
    method: 'DELETE'
  };
  return Promise.resolve()
    .then(() => sendMessage(params))
    .then(() => dispatch(commentDeleted({ id, field })))
    .catch(err => {
      console.error(err);
      dispatch(throwError('Error deleting comment'));
    });
};
