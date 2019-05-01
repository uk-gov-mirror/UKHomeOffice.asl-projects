import fetch from 'r2';
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
  const basename = state.application.basename.replace(/\/edit?/, '');
  return fetch(`${basename}/comment`, {
    method: 'POST',
    credentials: 'include',
    json: comment
  })
    .response
    .then(response => {
      return response.json()
        .then(json => {
          if (response.status > 399) {
            const err = new Error(json.message || `Failed to add comment with status code: ${response.status}`);
            err.status = response.status;
            Object.assign(err, json);
            throw err;
          }
          return json
        })
        .then(({ id }) => {
          dispatch(commentAdded({ ...comment, id, author: state.application.user }));
        });
    })
    .catch(err => {
      console.error(err);
      dispatch(throwError('Error posting comment, please try again'));
    });
};

export const deleteComment = ({ id, field }) => (dispatch, getState) => {
  const state = getState();
  const basename = state.application.basename.replace(/\/edit?/, '');
  return fetch(`${basename}/comment/${id}`, {
    method: 'DELETE',
    credentials: 'include'
  })
    .response
    .then(response => {
      return response.json()
        .then(json => {
          if (response.status > 399) {
            const err = new Error(json.message || `Failed delete comment with status code: ${response.status}`);
            err.status = response.status;
            Object.assign(err, json);
            throw err;
          }
        })
        .then(() => dispatch(commentDeleted({ id, field })));
    })
    .catch(err => {
      console.error(err);
      dispatch(throwError('Error deleting comment'));
    });
}
