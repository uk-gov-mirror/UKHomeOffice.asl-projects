import React, { Fragment } from 'react';
import { useSelector } from 'react-redux';
import { Button } from '@ukhomeoffice/react-components';

export default function NTS({ accepted, onAccept, review, hideTitle }) {
  const isFullApplication = useSelector(state => state.application.isFullApplication);

  if (isFullApplication) {
    return null;
  }

  return (
    <div className="nts">
      {
        !hideTitle && <h3>Creating your non-technical summary</h3>
      }
      <Fragment>
        <p>Any information you enter on this screen will form part of a non-technical summary (NTS) on GOV.UK, so use everyday language that can be easily understood by members of the public.</p>
        <p>As an NTS is a public document, do not include any information that could identify any people, locations, or intellectual property related to your project. You will be able to review and edit your NTS as a whole before you send your licence application to the Home Office.</p>
      </Fragment>
      {
        !review && (
          <Button disabled={accepted} onClick={onAccept}>Continue</Button>
        )
      }
    </div>
  );
}
