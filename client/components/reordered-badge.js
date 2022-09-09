import React from 'react';
import { useSelector, shallowEqual } from 'react-redux';

const selector = ({
  project: {
    protocols
  },
  application: {
    isGranted,
    previousProtocols: {
      previous
    }
  }
}) => ({
  protocols,
  previous,
  isGranted
});

export default function ReorderedBadge({ id }) {
  const { protocols, previous, isGranted } = useSelector(selector, shallowEqual);
  if (!previous) {
    return null;
  }

  const previousIds = previous.filter(p => !(protocols.find(protocol => protocol.id === p) || {}).deleted);
  const ids = (protocols || []).filter(p => !p.deleted).filter(p => previous.includes(p.id)).map(p => p.id);

  const previousIndex = previousIds.indexOf(id);
  const newIndex = ids.indexOf(id);

  if (isGranted || previousIndex === newIndex || !previous.includes(id)) {
    return null;
  }

  return <span className="badge reordered">{previousIndex > newIndex ? 'Moved up' : 'Moved down'}</span>;
}
