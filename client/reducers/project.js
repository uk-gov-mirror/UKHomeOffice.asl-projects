import * as types from '../actions/types';

const project = (state = {}, action) => {
  switch (action.type) {
    case types.LOAD_PROJECT:
    case types.UPDATE_PROJECT:
    case types.SET_PROJECT:
      return {
        ...action.project
      };
  }
  return state;
};

export default project;
