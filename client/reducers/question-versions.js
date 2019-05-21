import * as types from '../actions/types';

const questionVersions = (state = {}, action) => {

  switch (action.type) {
    case types.LOAD_QUESTION_VERSIONS:
      return {
        ...state,
        [action.key]: action.versions
      };
  }
  return state;
}

export default questionVersions;
