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
        <p>Any information you enter on this screen will form part of a non-technical summary (NTS) that will be made publicly available. For this reason you should use everyday language that can be easily understood by members of the public.</p>
        <p>You should also take care not to include information that could identify any people, locations, or intellectual property related to your project. You will be able to review and edit your NTS as a whole before you send your licence application to the Home Office.</p>
      </Fragment>
      {
        !review && !accepted && (
          <Button onClick={onAccept}>Continue</Button>
        )
      }
    </div>
  );
}
