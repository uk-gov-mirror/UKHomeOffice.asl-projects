import React, { useState, useRef, useEffect, Fragment } from 'react';
import { useSelector, shallowEqual } from 'react-redux';
import DownloadLink from './download-link';

const selector = (({
  project: { title, id },
  application: {
    isGranted,
    basename,
    drafting
  }
}) => ({
  id,
  title,
  isGranted,
  basename,
  drafting
}))

export default function DownloadHeader() {
  const [modalShowing, updateModalShowing] = useState(false);
  const container = useRef(null);
  const download = useRef(null);

  const props = useSelector(selector, shallowEqual);
  const {
    id,
    title,
    isGranted,
    drafting,
  } = props;
  let { basename = window.location.href } = props;

  basename = basename.replace(/\/edit/, '');

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
              {
                drafting
                  ? (
                    <Fragment>
                      <DownloadLink project={id} label="Word (.docx)" renderer="docx" />
                      <DownloadLink project={id} label="Backup (.ppl)" renderer="ppl" />
                    </Fragment>
                  )
                  : (
                    <Fragment>
                      <a className="close" href="#" onClick={toggleModal}>✕</a>
                      <a href={`${basename}/pdf`}>As PDF</a> | <a href={`${basename}/docx`}>As Word (.docx)</a>
                    </Fragment>
                  )
              }
            </div>
          )
        }
      </div>
      <div className="left">
        <h2>{title || 'Untitled project'}</h2>
      </div>
    </div>
  );
}
