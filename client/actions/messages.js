import * as types from './types';

let hideTimeout;

export function hideMessage() {
  return {
    type: types.HIDE_MESSAGE
  };
}

export function showMessage(message) {
  return (dispatch) => {
    clearTimeout(hideTimeout);
    hideTimeout = setTimeout(() => {
      dispatch(hideMessage());
    }, 5000);
    return dispatch({ type: types.SHOW_MESSAGE, message });
  };
}

export function showWarning(message) {
  return (dispatch) => {
    return dispatch({ type: types.SHOW_WARNING, message });
  };
}

export function throwError(message) {
  return (dispatch) => {
    clearTimeout(hideTimeout);
    return dispatch({ type: types.ERROR, error: { message } });
  };
}
