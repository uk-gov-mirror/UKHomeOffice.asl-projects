import * as types from '../actions/types';

const comments = (state = {}, action) => {
  switch (action.type) {
    case types.ADD_COMMENT:
      return {
        ...state,
        [action.field]: [
          ...(state[action.field] || []),
          {
            comment: action.comment,
            author: action.author,
            isNew: true
          }
        ]
      }
  }
  return state
};

export default comments;
