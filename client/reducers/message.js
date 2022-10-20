import * as types from '../actions/types';

export default function messageReducer(state = {}, action) {
  switch (action.type) {
    case types.SHOW_MESSAGE:
      return { message: action.message, type: 'alert' };
    case types.SHOW_WARNING:
      return { message: action.message, type: 'warning' };
    case types.ERROR:
      return { message: action.error.message, type: 'error' };
    case types.HIDE_MESSAGE:
      return { message: null };
    default:
      return state;
  }
}
