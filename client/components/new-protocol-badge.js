import React from 'react';
import { useSelector } from 'react-redux';
import classnames from 'classnames';

export default function NewProtocolBadge({ id }) {
  const previousProtocols = useSelector(state => state.application.previousProtocols);
  if (!previousProtocols) {
    return null;
  }
  const { granted, previous } = previousProtocols;

  const notNew = !granted.length && (!previous.length || previous.includes(id));

  if (granted.includes(id) || notNew) {
    return null;
  }

  return <span className={classnames('badge', { created: !previous.includes(id) })}>new</span>
}
