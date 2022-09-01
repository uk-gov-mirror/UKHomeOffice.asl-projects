import React, {useEffect} from 'react';

export default function Modal({ onClose, children }) {
  useEffect(() => {
    const keydownHandler = e => {
      if (e.key === 'Escape') {
        onClose(e);
      }
    }
    document.getElementsByTagName('html')[0].classList.add('modal-open');
    document.addEventListener("keydown", keydownHandler);

    return () => {
      document.getElementsByTagName('html')[0].classList.remove('modal-open');
      document.removeEventListener("keydown", keydownHandler);
    }
  })

  const close = e => {
    if (e.target.className === 'modal') {
      onClose(e)
    }
  }

  return (
    <div className="modal" onClick={close}>
      <div className="modal-content">
        {children}
      </div>
    </div>
  )
}
