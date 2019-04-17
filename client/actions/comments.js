import fetch from 'r2';
import { throwError } from './messages';

import { ADD_COMMENT } from './types'

export const commentAdded = ({ comment, author, field }) => {
  return {
    type: ADD_COMMENT,
    comment,
    author,
    field
  }
}

const postData = (comment, getState, dispatch) => {
  const state = getState();
  const basename = state.application.basename.replace(/\/edit?/, '')
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
        })
        .then(() => {
          dispatch(commentAdded({ ...comment, author: state.application.user }));
        });
    })
    .catch(err => {
      console.error(err);
      dispatch(throwError('Error posting comment, please try again'));
    });
};

export const addComment = comment => (dispatch, getState) => Promise.resolve().then(() => {
  return postData(comment, getState, dispatch);
});
