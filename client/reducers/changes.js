import * as types from '../actions/types';

const INITIAL_STATE = {
  latest: [],
  granted: []
};

const changedItems = (state = [], action) => {
  if (state.includes(action.change)) {
    return state;
  }
  return [
    ...state,
    action.change
  ];
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
