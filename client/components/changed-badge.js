import React from 'react';
import { connect } from 'react-redux';

const ChangedBadge = ({ fields = [], latest = [], granted = [] }) => {
  const hasChangedFromLatest = latest.length && fields.some(field => latest.some(change => change.includes(field)));
  if (hasChangedFromLatest) {
    return <span className="badge changed">changed</span>;
  }
  const hasChangedFromGranted = granted.length && fields.some(field => granted.some(change => change.includes(field)));
  if (hasChangedFromGranted) {
    return <span className="badge">amended</span>;
  }
  return null;
};

const mapStateToProps = ({changes: { latest, granted }}) => ({ latest, granted });

export default connect(mapStateToProps)(ChangedBadge);
