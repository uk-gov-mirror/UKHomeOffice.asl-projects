import React from 'react';
import { connect } from 'react-redux';

const ChangedBadge = ({ fields = [], latest = [], granted = [] }) => {
  const changedFrom = source => source.length && fields.some(field => source.some(change => change === field));

  if (changedFrom(latest)) {
    return <span className="badge changed">changed</span>;
  }
  if (changedFrom(granted)) {
    return <span className="badge">amended</span>;
  }

  return null;
};

const mapStateToProps = ({changes: { latest, granted }}) => ({ latest, granted });

export default connect(mapStateToProps)(ChangedBadge);
