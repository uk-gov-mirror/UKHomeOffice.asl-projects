import {
  IS_SYNCING,
  DONE_SYNCING,
  SET_BASENAME
} from '../actions/types';

const INITIAL_STATE = {
  schemaVersion: 1,
  readonly: false,
  establishment: null,
  isSyncing: false
};

export default function applicationReducer(state = INITIAL_STATE, action) {
  // use defaults for missing props from server.
  if (!state.hydrated) {
    state = { ...INITIAL_STATE, ...state, hydrated: true };
  }
  switch (action.type) {
    case IS_SYNCING:
      return {
        ...state,
        isSyncing: true
      }
    case DONE_SYNCING:
      return {
        ...state,
        isSyncing: false
      }
    case SET_BASENAME:
      return {
        ...state,
        basename: action.basename
      }
    default:
      return state;
  }
}
