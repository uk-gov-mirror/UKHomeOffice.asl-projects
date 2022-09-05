import React, { useEffect } from 'react';
import { useSelector, shallowEqual } from 'react-redux'
import isEqual from 'lodash/isEqual';
import classnames from 'classnames';

export const selector = ({
  project: version,
  savedProject,
  application: {
    readonly,
    editConditions
  }
}) => {
  // only compare version data if version is in an editable state
  const editable = !readonly || editConditions;
  const isSyncing = editable && !isEqual(version, savedProject);
  return { isSyncing };
};

const SyncHandler = () => {

  const { isSyncing } = useSelector(selector, shallowEqual);

  useEffect(() => {
    window.onbeforeunload = () => {
      if (isSyncing) {
        return true;
      }
    }

    const nextSteps = document.querySelector('#page-component > p.next-steps > a');
    const statusMessage = document.querySelector('#page-component > p.next-steps > span.status-message');

    if (isSyncing) {
      if (nextSteps) {
        nextSteps.setAttribute('disabled', true);
        nextSteps.onclick = () => false;
      }
      statusMessage && (statusMessage.innerText = 'Saving...');
    } else {
      if (nextSteps) {
        nextSteps.removeAttribute('disabled');
        nextSteps.onclick = null;
      }
      statusMessage && (statusMessage.innerText = '');
    }

    return () => {
      window.onbeforeunload = null;
      if (nextSteps) {
        nextSteps.removeAttribute('disabled');
        nextSteps.onclick = null;
      }
      statusMessage && (statusMessage.innerText = '');
    }
  }, [isSyncing]);

  return <div className={classnames('sync-indicator', { syncing: isSyncing })}>
    { isSyncing ? 'Saving...' : 'Saved' }
  </div>;
};

export default SyncHandler;
