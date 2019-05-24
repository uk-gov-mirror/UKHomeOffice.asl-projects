import React, { Component } from 'react';

class Modal extends Component {
  componentDidMount() {
    document.getElementsByTagName('html')[0].classList.add('modal-open');
  }

  componentWillUnmount() {
    document.getElementsByTagName('html')[0].classList.remove('modal-open');
  }

  close = e => {
    if (e.target.className === 'modal') {
      this.props.onClose(e)
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
