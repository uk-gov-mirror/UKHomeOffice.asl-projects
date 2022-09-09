import * as types from '../actions/types';

const savedProject = (state = {}, action) => {
  switch (action.type) {
    case types.LOAD_PROJECT:
    case types.SET_PROJECT:
    case types.UPDATE_SAVED_PROJECT:
      return {
        ...action.project
      };
  }
  return state;
};

export default savedProject;
