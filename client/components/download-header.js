import React, { useState, useRef, useEffect } from 'react';
import { connect } from 'react-redux';

function DownloadHeader({ title, isGranted }) {
  const [modalShowing, updateModalShowing] = useState(false);
  const container = useRef(null);
  const download = useRef(null);

  // project title could span multiple lines, adjust download position accordingly
  useEffect(() => {
    // subtract padding, and border
    const height = container.current.offsetHeight - 30 - 4;
    download.current.style.height = `${height}px`;
    download.current.style.lineHeight = `${height}px`;
  });

  function toggleModal(e) {
    e.preventDefault();
    updateModalShowing(!modalShowing);
  }

  return (
    <div className="download-header" ref={container}>
      <div className="right" ref={download}>
        <a href="#" className="download" onClick={toggleModal}>{`Download ${isGranted ? 'licence' : 'application'}`}</a>
        {
          modalShowing && (
            <div className="download-modal">
              <a className="close" href="#" onClick={toggleModal}>✕</a>
              <a href="pdf">{`As PDF ${isGranted ? 'licence' : 'preview'}`}</a> | <a href="docx">As Word document</a>
            </div>
          )
        }
      </div>
      <div className="left">
        <h2>{title || 'Untitled project'}</h2>
      </div>
    </div>
  );
};

export default connect(({
  project: { title },
  application: { isGranted }
}) => ({
  title,
  isGranted
}))(DownloadHeader);
