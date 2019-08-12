import {
  IS_SYNCING,
  DONE_SYNCING
} from '../actions/types';

const INITIAL_STATE = {
  schemaVersion: 1,
  readonly: false,
  establishment: null,
  isSyncing: false
};

export default function applicationReducer(state = INITIAL_STATE, action) {
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
    default:
      return state;
  }
}
