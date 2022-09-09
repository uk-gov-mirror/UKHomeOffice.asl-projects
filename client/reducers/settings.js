import * as types from '../actions/types';

export default function settingsReducer(state = {}, action) {
  switch (action.type) {
    case types.LOAD_SETTINGS:
      return action.settings || state;
    case types.UPDATE_SETTINGS:
      return {
        ...state,
        ...action.settings
      };
    default:
      return state;
  }
}
