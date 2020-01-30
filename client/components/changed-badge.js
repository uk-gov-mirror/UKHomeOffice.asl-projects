import React from 'react';
import { useSelector, shallowEqual } from 'react-redux';

const selector = ({
  changes: {
    latest = [],
    granted = []
  } = {},
  application: {
    previousProtocols
  } = {}
}) => ({
  latest,
  granted,
  previousProtocols
});

export default function ChangedBadge({ fields = [], changedFromGranted, changedFromLatest, protocolId, noLabel }) {
  const { latest, granted, previousProtocols } = useSelector(selector, shallowEqual);
  if (!latest.length && !granted.length) {
    return null;
  }
  const changedFrom = source => {
    return source.length && fields.some(field => {
      if (field.includes('*')) {
        field = field.split('.*')[0];
      }
      return source.some(change => change === field)
    });
  }

  if ((changedFromLatest || changedFrom(latest)) && (!protocolId || previousProtocols.previous.includes(protocolId))) {
    return <span className="badge changed">{ noLabel ? '' : 'changed' }</span>;
  }
  if ((changedFromGranted || changedFrom(granted)) && (!protocolId || previousProtocols.granted.includes(protocolId))) {
    return <span className="badge">{noLabel ? '' : 'amended'}</span>;
  }

  return null;
}
