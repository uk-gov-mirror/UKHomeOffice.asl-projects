import React, { Component } from 'react';

class Modal extends Component {
  close = e => {
    if (e.target.className === 'modal') {
      this.props.onClose()
    }
  }

  render () {
    const { children } = this.props;
    return (
      <div className="modal" onClick={this.close}>
        <div className="modal-content">
          { children }
        </div>
      </div>
    )
  }
}

export default Modal;
