import * as types from '../actions/types';

const INITIAL_STATE = {
  latest: [],
  granted: []
};

const changedItems = (state = [], action) => {

  const changes = action.changes.filter(c => !state.includes(c));
  return [...state, ...changes];
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
