import * as types from '../actions/types';

const INITIAL_STATE = {
  schemaVersion: 1,
  readonly: false,
  establishment: null,
  isSyncing: false,
  syncError: false,
  errorCount: 0,
  previousProtocols: {}
};

export default function applicationReducer(state = INITIAL_STATE, action) {
  // use defaults for missing props from server.
  if (!state.hydrated) {
    state = { ...INITIAL_STATE, ...state, hydrated: true };
  }
  switch (action.type) {
    case types.IS_SYNCING:
      return {
        ...state,
        isSyncing: true
      };
    case types.DONE_SYNCING:
      return {
        ...state,
        isSyncing: false
      };
    case types.SET_BASENAME:
      return {
        ...state,
        basename: action.basename
      };
    case types.SYNC_ERROR:
      return {
        ...state,
        syncError: true,
        errorCount: state.errorCount + 1
      };
    case types.SYNC_ERROR_RESOLVED:
      return {
        ...state,
        syncError: false,
        errorCount: 0
      };
    default:
      return state;
  }
}
