import * as types from './types';
import database from '../database';

export function loadSettings() {
  return dispatch => {
    return database()
      .then(db => db.list('settings'))
      .then(settings => dispatch({ type: types.LOAD_SETTINGS, settings: settings[0] }))
      .catch(error => dispatch({ type: types.ERROR, error }));
  };
}

export function updateSettings(key, value) {
  return (dispatch, getState) => {
    const settings = getState().settings;
    if (!settings) {
      return dispatch({ type: types.ERROR, error: new Error(`Settings not set`) });
    }
    return database()
      .then(db => db.update(0, { ...settings, [key]: value }, 'settings'))
      .then(settings => dispatch({ type: types.UPDATE_SETTINGS, settings }))
      .catch(error => dispatch({ type: types.ERROR, error }));
  };
}
