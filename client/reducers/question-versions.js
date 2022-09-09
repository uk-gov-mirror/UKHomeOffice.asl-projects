import * as types from '../actions/types';

const questionVersions = (state = {}, action) => {

  switch (action.type) {
    case types.LOAD_QUESTION_VERSIONS:
      return {
        ...state,
        [action.key]: {
          ...(state[action.key] || {}),
          [action.version]: action.value
        }
      };
  }
  return state;
};

export default questionVersions;
