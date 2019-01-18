import * as types from './types';

export function showMessage(message) {
  return (dispatch) => {
    setTimeout(() => {
      dispatch({ type: types.HIDE_MESSAGE });
    }, 5000);
    return dispatch({ type: types.SHOW_MESSAGE, message });
  };
}

export function throwError(message) {
  return (dispatch) => {
    setTimeout(() => {
      dispatch({ type: types.HIDE_MESSAGE });
    }, 5000);
    return dispatch({ type: types.ERROR, error: { message } });
  };
}
