import * as types from '../actions/types';

const comments = (state = {}, action) => {
  switch (action.type) {
    case types.COMMENT_ADDED:
      return {
        ...state,
        [action.field]: [
          {
            id: action.id,
            comment: action.comment,
            author: action.author,
            isNew: true,
            isMine: true
          },
          ...(state[action.field] || [])
        ]
      };

    case types.COMMENT_EDITED:
      return {
        ...state,
        [action.field]: (state[action.field] || []).map(comment => {
          if (comment.id === action.id) {
            return {
              ...comment,
              comment: action.comment
            };
          }
          return comment;
        })
      };

    case types.REFRESH_COMMENTS:
      return action.comments;

    case types.COMMENT_DELETED:
      return {
        ...state,
        [action.field]: (state[action.field] || []).map(comment => {
          if (comment.id === action.id) {
            return {
              ...comment,
              deleted: true
            };
          }
          return comment;
        })
      };
  }
  return state;
};

export default comments;
