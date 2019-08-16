import * as types from '../actions/types';

const INITIAL_STATE = {
  latest: [],
  granted: []
};

const changedItems = (state = [], action) => {
  const paths = action.change.split('.').map((_, i, arr) => arr.slice(0, i + 1).join('.'));

  return paths.reduce((arr, path) => {
    return arr.includes(path) ? arr : [ ...arr, path ];
  }, state);
};

const changes = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case types.ADD_CHANGE: {
      return {
        ...state,
        latest: changedItems(state.latest, action)
      };
    }
  }

  return state;
};

export default changes;
