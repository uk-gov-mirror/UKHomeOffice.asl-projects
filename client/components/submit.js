import React, { Fragment } from 'react';
import { useSelector, shallowEqual } from 'react-redux';
import { Button } from '@ukhomeoffice/react-components';

export default function Submit({ onComplete }) {
  const { readonly, schemaVersion, project, projectUrl, canSubmit } = useSelector(state => state.application, shallowEqual);
  const isLegacy = schemaVersion === 0;
  const isRa = schemaVersion === 'RA';
  const type = isRa
    ? 'retrospective assessment'
    : (project.status === 'inactive' ? 'application' : 'amendment');

  return (
    <Fragment>
      {
        !readonly && (
          <Fragment>
            <h2>{`Submit ${type}`}</h2>
            {
              canSubmit
                ? (
                  <Fragment>
                    {
                      !isLegacy && <p>All sections must be marked as complete before you can continue.</p>
                    }
                    <Button onClick={onComplete}>
                      {
                        project.isLegacyStub ? 'Continue to final confirmation' : 'Continue'
                      }
                    </Button>
                  </Fragment>
                )
                : (
                  <p>Only the licence holder or an admin can submit this to the Home Office</p>
                )
            }
          </Fragment>
        )
      }
      <p className="back-to-project">
        <a href={projectUrl}>Go to project overview</a>
      </p>
    </Fragment>
  )
}
