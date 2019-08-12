import React from 'react';

class ChangedBadge extends React.Component {
  render() {
    if (this.props.fields.some( k=> this.props.latest.some( l=> l.includes(k)))) {
      return <span className="badge changed">changed</span>;
    }
    if (this.props.fields.some( k=> this.props.granted.some( l=> l.includes(k)))) {
      return <span className="badge">amended</span>;
    }
    return null;
  }
}

export default ChangedBadge;
