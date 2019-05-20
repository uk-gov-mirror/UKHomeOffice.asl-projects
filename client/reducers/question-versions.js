import * as types from '../actions/types';

const questionVersions = (state = {}, action) => {

  switch (action.type) {
    case types.LOAD_QUESTION_VERSIONS:
      return action.versions;
  }
  return state;
}

export default questionVersions;
