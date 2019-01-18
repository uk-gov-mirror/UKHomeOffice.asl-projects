import { omit } from 'lodash';

import * as types from './types';
import database from '../database';

import { showMessage } from './messages';

export function loadProjects() {
  return dispatch => {
    return database()
      .then(db => db.list())
      .then(projects => dispatch({ type: types.LOAD_PROJECTS, projects }))
      .catch(error => dispatch({ type: types.ERROR, error }));
  };
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

export function updateProject(id, data) {
  return (dispatch, getState) => {
    const project = getState().projects.find(p => p.id === id);
    if (!project) {
      return dispatch({ type: types.ERROR, error: new Error(`Unknown project: ${id}`) });
    }
    return database()
      .then(db => db.update(id, { ...project, ...data }))
      .then(project => dispatch({ type: types.UPDATE_PROJECT, id, project }))
      .catch(error => dispatch({ type: types.ERROR, error }));
  };
}
