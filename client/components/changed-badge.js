import React from 'react';
import { useSelector, shallowEqual } from 'react-redux';

const selector = ({
  changes: {
    latest,
    granted
  },
  application: {
    previousProtocols
  }
}) => ({
  latest,
  granted,
  previousProtocols
});

export default function ChangedBadge({ fields = [], protocolId }) {
  const { latest = [], granted = [], previousProtocols } = useSelector(selector, shallowEqual);
  const changedFrom = source => source.length && fields.some(field => source.some(change => change === field));

  if (changedFrom(latest) && (!protocolId || previousProtocols.previous.includes(protocolId))) {
    return <span className="badge changed">changed</span>;
  }
  if (changedFrom(granted) && (!protocolId || previousProtocols.granted.includes(protocolId))) {
    return <span className="badge">amended</span>;
  }

  return null;
}
