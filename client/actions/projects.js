import omit from 'lodash/omit';
import debounce from 'lodash/debounce';
import cloneDeep from 'lodash/cloneDeep';
import isEqual from 'lodash/isEqual';
import get from 'lodash/get';

import * as types from './types';
import database from '../database';
import { throwError } from './messages';
import { showMessage } from './messages';
import sendMessage from './messaging';

export function loadProjects() {
  return dispatch => {
    return database()
      .then(db => db.list())
      .then(projects => dispatch({ type: types.LOAD_PROJECTS, projects }))
      .catch(error => dispatch({ type: types.ERROR, error }));
  };
}

export function loadProject(id) {
  return dispatch => {
    return database()
      .then(db => db.read(id))
      .then(project => dispatch({ type: types.LOAD_PROJECT, project }))
      .catch(error => dispatch({ type: types.ERROR, error }));
  };
}

export function setProject(project) {
  return {
    type: types.SET_PROJECT,
    project
  }
}

export function createProject(project) {
  return dispatch => {
    return database()
      .then(db => db.create(project))
      .then(project => {
        dispatch({ type: types.CREATE_PROJECT, project });
        dispatch(showMessage('Project created!'));
        return project;
      })
      .catch(error => dispatch({ type: types.ERROR, error }));
  };
}

export function importProject(project) {
  project = omit(project, 'id');
  return dispatch => {
    return database()
      .then(db => db.create(project))
      .then(project => dispatch({ type: types.CREATE_PROJECT, project }))
      .then(() => dispatch(showMessage('Project imported!')))
      .catch(error => dispatch({ type: types.ERROR, error }));
  };
}

export function deleteProject(id) {
  return dispatch => {
    return database()
      .then(db => db.delete(id))
      .then(() => dispatch({ type: types.DELETE_PROJECT, id }))
      .then(() => dispatch(showMessage('Project deleted!')))
      .catch(error => dispatch({ type: types.ERROR, error }));
  };
}

export function updateProject(project) {
  return {
    type: types.UPDATE_PROJECT,
    project
  }
}

export function addChange(change) {
  return {
    type: types.ADD_CHANGE,
    change
  }
}

export function updateSavedProject(project) {
  return {
    type: types.UPDATE_SAVED_PROJECT,
    project
  }
}

export function isSyncing() {
  return {
    type: types.IS_SYNCING
  }
}

export function doneSyncing() {
  return {
    type: types.DONE_SYNCING
  }
}

const debouncedUpdate = debounce((id, data, dispatch) => {
  return database()
    .then(db => db.update(id, data))
    .then(() => updateSavedProject(data))
    // TODO: notify user autosaved.
    .catch(err => dispatch({ type: types.ERROR, err }))
}, 500, { maxWait: 5000 })

export function updateAndSave(data) {
  return (dispatch, getState) => {
    const project = getState().project;
    const newState = { ...project, ...data };
    dispatch(updateProject(newState));
    const id = project.id;
    return debouncedUpdate(id, newState, dispatch);
  };
}

const sync = (dispatch, getState, field, extra = {}) => {
  const state = getState();
  const oldValue = get(state.savedProject, field);
  const newValue = get(state.project, field);

  if (isEqual(oldValue, newValue)) {
    dispatch(doneSyncing());
    return Promise.resolve();
  }
  dispatch(isSyncing());

  const { application: { basename } } = getState();
  const params = {
    method: 'PUT',
    url: `${basename.replace(/\/edit?/, '')}/conditions`,
    data: {
      [field]: newValue,
      ...extra
    }
  };

  return Promise.resolve()
    .then(() => sendMessage(params))
    .then(() => dispatch(updateSavedProject(state.project)))
    .then(() => sync(dispatch, getState, field, extra))
    .catch(err => {
      console.error(err);
      sync(dispatch, getState, field, extra);
    });
}

export function updateRetrospectiveAssessment(retrospectiveAssessment) {
  return (dispatch, getState) => {
    const state = getState();
    const newState = {
      ...state.project,
      retrospectiveAssessment
    };
    dispatch(updateProject(newState));
    if (!state.application.isSyncing) {
      return sync(dispatch, getState, 'retrospectiveAssessment')
        .then(() => dispatch(showMessage('Retrospective assessment details saved')))
        .catch(() => dispatch(throwError('Data sync failed')))
    }
  }
}

export function updateConditions(type, conditions, protocolId) {
  return (dispatch, getState) => {
    const state = getState();
    const newConditions = !protocolId
      ? [
        ...(state.project.conditions || []).filter(condition => condition.type !== type),
        ...conditions
      ]
      : [
        ...((state.project.protocols || [])
          .find((p => p.id === protocolId) || {}).conditions || []).filter(condition => condition.type !== type),
        ...conditions
      ]

    const newState = cloneDeep(state.project);
    if (protocolId) {
      newState.protocols = newState.protocols.map(protocol => {
        if (protocol.id === protocolId) {
          return { ...protocol, conditions: newConditions }
        }
        return protocol;
      })
    } else {
      newState.conditions = type === 'legacy' ? conditions : newConditions;
    }
    dispatch(updateProject(newState));
    if (!state.application.isSyncing) {
      return sync(dispatch, getState, 'conditions', protocolId && { protocolId })
        .then(() => dispatch(showMessage(`${type === 'condition' ? 'Conditions': 'Authorisations'} synced`)))
        .catch(() => dispatch(throwError('Data sync failed')))
    }
  }
}

export function fetchQuestionVersions(key) {

  return (dispatch, getState) => {
    const { application: { basename } } = getState();

    const params = {
      url: `${basename}/question/${key}`
    }

    return Promise.resolve()
      .then(() => sendMessage(params))
      .then(versions => dispatch({ type: types.LOAD_QUESTION_VERSIONS, versions, key }))
      .catch(error => dispatch({ type: types.ERROR, error }));
  }
}
