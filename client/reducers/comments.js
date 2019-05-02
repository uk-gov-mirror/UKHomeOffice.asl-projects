import * as types from '../actions/types';

const comments = (state = {}, action) => {
  switch (action.type) {
    case types.ADD_COMMENT:
      return {
        ...state,
        [action.field]: [
          ...(state[action.field] || []),
          {
            id: action.id,
            comment: action.comment,
            author: action.author,
            isNew: true
          }
        ]
      }
    case types.DELETE_COMMENT:
      return {
        ...state,
        [action.field]: (state[action.field] || []).map(comment => {
          if (comment.id === action.id) {
            return {
              ...comment,
              deleted: true
            }
          }
          return comment;
        })
      };
  }
  return state
};

export default comments;
