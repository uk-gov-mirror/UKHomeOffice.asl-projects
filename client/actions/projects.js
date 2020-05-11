import omit from 'lodash/omit';
import debounce from 'lodash/debounce';
import cloneDeep from 'lodash/cloneDeep';
import isEqual from 'lodash/isEqual';
import pick from 'lodash/pick'
import { diff, applyChange } from 'deep-diff';

import * as types from './types';
import { showMessage, throwError } from './messages';
import sendMessage from './messaging';
import { getConditions } from '../helpers';
import cleanProtocols from '../helpers/clean-protocols';

const CONDITIONS_FIELDS = ['conditions', 'retrospectiveAssessment'];

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

export function addChanges(changes = {}) {
  return {
    type: types.ADD_CHANGES,
    granted: changes.granted || [],
    latest: changes.latest || []
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

export function syncError() {
  return {
    type: types.SYNC_ERROR
  }
}

export function syncErrorResolved() {
  return {
    type: types.SYNC_ERROR_RESOLVED
  }
}

const conditionsToSync = (state) => {
  if (state.application.isSyncing) {
    return null;
  }
  const projectConditions = getConditionsToSync(state.project);
  if (!isEqual(getConditionsToSync(state.savedProject), projectConditions)) {
    return projectConditions;
  }
  return state.project.protocols.reduce((data, protocol) => {
    if (data) {
      return data;
    }
    const protocolConditions = getConditionsToSync(state.project, protocol.id);
    if (!isEqual(getConditionsToSync(state.savedProject, protocol.id), protocolConditions)) {
      return protocolConditions;
    }
    return null;
  }, null);
};

const getConditionsToSync = (project, protocolId) => {
  if (protocolId) {
    const protocol = project.protocols.find(p => p.id === protocolId);
    return {
      ...pick(protocol, CONDITIONS_FIELDS),
      protocolId
    };
  }
  return pick(project, CONDITIONS_FIELDS);
};

const syncConditions = (dispatch, getState) => {
  const state = getState();
  const data = conditionsToSync(state);
  if (!data) {
    return Promise.resolve();
  }

  dispatch(isSyncing());

  const params = {
    state,
    method: 'PUT',
    url: `${state.application.basename}/conditions`,
    data
  }

  return Promise.resolve()
    .then(() => sendMessage(params))
    .then(() => {
      dispatch(doneSyncing())
      if (state.application.syncError) {
        dispatch(syncErrorResolved());
        dispatch(showMessage('Saved successfully'))
      }
    })
    .then(() => dispatch(updateSavedProject(applyConditions(state.savedProject, data))))
    .then(() => syncConditions(dispatch, getState))
    .catch(err => {
      return onSyncError(syncConditions, err, dispatch, getState)
    });
};

const applyConditions = (state, conditions) => {
  if (conditions.protocolId) {
    const protocols = state.protocols.map(p => {
      if (p.id === conditions.protocolId) {
        return { ...p, ...pick(conditions, CONDITIONS_FIELDS) };
      }
      return p;
    });
    return { ...state, protocols };
  }
  return { ...state, ...pick(conditions, CONDITIONS_FIELDS) };
};

const shouldSyncProject = state => {
  if (state.application.isSyncing) {
    return false;
  }
  return !isEqual(state.savedProject, state.project);
};

const applyPatches = (source, patches = []) => {
  const patched = cloneDeep(source);
  patches.forEach(p => {
    applyChange(patched, p);
  });
  return patched;
};

const onSyncError = (func, err, dispatch, getState, ...args) => {
  console.error(err);
  dispatch(doneSyncing());
  dispatch(syncError());
  dispatch(throwError('Failed to save, trying again'));
  return setTimeout(() => func(dispatch, getState, ...args), 1000);
};

function getProjectWithConditions(project) {
  return {
    ...project,
    conditions: getConditions(project),
    protocols: (project.protocols || []).map(protocol => {
      return {
        ...protocol,
        conditions: getConditions(protocol, project)
      };
    })
  };
}

const syncProject = (dispatch, getState) => {
  const state = getState();

  if (!shouldSyncProject(state)) {
    return Promise.resolve();
  }

  dispatch(isSyncing());

  // don't evaluate conditions on legacy projects
  const project = state.application.schemaVersion > 0
    ? getProjectWithConditions(state.project)
    : state.project;

  const patch = diff(state.savedProject, project);
  if (!patch || !patch.length) {
    return Promise.resolve();
  }

  const data = patch.map(d => d.kind === 'edit' ? omit(d, 'lhs') : d);

  const params = {
    state,
    method: 'PUT',
    url: state.application.basename,
    data
  };

  return Promise.resolve()
    .then(() => dispatch(updateProject(project)))
    .then(() => sendMessage(params))
    .then(json => {
      dispatch(addChanges(json.changes))
      dispatch(doneSyncing())
      if (state.application.syncError) {
        dispatch(syncErrorResolved());
        dispatch(showMessage('Saved successfully'))
      }
    })
    .then(() => {
      const patched = applyPatches(state.savedProject, patch);
      dispatch(updateSavedProject(patched));
    })
    .then(() => syncProject(dispatch, getState))
    .catch(err => {
      onSyncError(syncProject, err, dispatch, getState)
    });
}

const debouncedSyncConditions = debounce((dispatch, getState) => {
  return syncConditions(dispatch, getState)
}, 1000, { maxWait: 5000, leading: true });

export function updateRetrospectiveAssessment(retrospectiveAssessment) {
  return (dispatch, getState) => {
    const state = getState();
    const newState = {
      ...state.project,
      retrospectiveAssessment
    };
    dispatch(updateProject(newState));
    return debouncedSyncConditions(dispatch, getState);
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
    return debouncedSyncConditions(dispatch, getState)
  }
}

export function fetchQuestionVersions(key) {

  return (dispatch, getState) => {
    const state = getState();

    const params = {
      state,
      url: `question/${key}`
    }

    return Promise.resolve()
      .then(() => sendMessage(params))
      .then(versions => dispatch({ type: types.LOAD_QUESTION_VERSIONS, versions, key }))
      .catch(error => dispatch({ type: types.ERROR, error }));
  }
}

const debouncedSyncProject = debounce((...args) => {
  return syncProject(...args);
}, 1000, { maxWait: 5000, leading: true });

export const sync = props => {
  return (dispatch, getState) => {
    const { project, application: { establishment } } = getState();
    const newState = cleanProtocols(project, props, establishment);

    dispatch(updateProject(newState));
    return debouncedSyncProject(dispatch, getState);
  };
};
