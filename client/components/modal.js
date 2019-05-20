import React, { Component } from 'react';

class Modal extends Component {

  render() {
    return (
      <div className='modal'>
        <div className='govuk-grid-row'>
          <p>{this.props.versions.granted}</p>
          <p>{this.props.versions.previous}</p>
        </div>
      </div>
    );
  }
}

export default Modal;
