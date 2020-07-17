import React, { useState, useEffect, Fragment } from 'react';
import { RadioGroup, Warning } from '@ukhomeoffice/react-components';
import { Details, Inset, Markdown, Link } from '@asl/components';
import { useSelector, shallowEqual } from 'react-redux';

const revealContent = `To change the primary establishment you must:

* have the agreement of both establishment licence holders
* take the application through the AWERB review process at the new establishment (and any additional establishments)
* review any related sections of the application that appear as ‘incomplete'`

export default function EstablishmentSelector({ value, onFieldChange, review, diff, ...props }) {
  const {
    establishments,
    canTransfer,
    canTransferDraft,
    establishment,
    transferInProgress,
    readonly,
    project,
    isGranted,
    legacyGranted
  } = useSelector(state => state.application, shallowEqual);

  if (isGranted || legacyGranted) {
    return <p>{establishment.name}</p>
  }

  const [localValue, setLocalValue] = useState(value);

  const canUpdateEstablishment = canTransfer && establishments.length > 1 && !transferInProgress;
  const draft = project.status === 'inactive';

  const options = (establishments || []).map(e => ({
    label: e.name,
    value: e.id,
    reveal: e.id !== establishment.id && !draft && (
      <Inset>
        <Markdown>
          {revealContent}
        </Markdown>
        <Warning>Once submitted, you won’t be able withdraw this change without discarding the entire amendment.</Warning>
      </Inset>
    )
  }));

  useEffect(() => {
    if (onFieldChange && localValue !== value) {
      onFieldChange({
        'transfer-of-animals-complete': false,
        'protocols-complete': false,
        'experience-complete': false,
        transferToEstablishment: localValue
      });
    }
  }, [localValue]);

  const displayEstablishment = localValue
    ? establishments.find(e => e.id === localValue) || {}
    : establishment;

  const establishmentName = displayEstablishment.name || 'Another establishment';

  if (draft && canTransferDraft) {
    return (
      <div className="govuk-form-group">
        <fieldset className="govuk-fieldset inline smaller">
          <legend className="govuk-fieldset__legend">
            <h2 className="govuk-fieldset__heading govuk-heading-l">Primary establishment</h2>
          </legend>
          <p>{establishmentName}</p>
          <p><Link page="project.transferDraft" label="Change" establishmentId={establishment.id} projectId={project.id} /></p>
        </fieldset>
      </div>
    );
  }

  return (
    <div className="establishment-selector">
      {
        canUpdateEstablishment && !review
          ? (
            <RadioGroup
              {...props}
              type="radio"
              options={options}
              value={localValue || establishment.id}
              onChange={e => setLocalValue(parseInt(e.target.value, 10))}
            />
          )
          : (
            <Fragment>
              {
                !review && <h3>{ props.label }</h3>
              }
              <p>{establishmentName}</p>

              {
                readonly
                  ? (
                    <Fragment>
                      {
                        !diff && <Inset><p>The project licence holder has requested an amendment to transfer this licence to another establishment</p></Inset>
                      }
                    </Fragment>
                  )
                  : (
                    <Fragment>
                      {
                        canTransfer && transferInProgress && <Inset><p>To change the primary establishment again, you’ll need to discard this amendment and start a new one.</p></Inset>
                      }
                      {
                        !canTransfer && <Inset><p>Only the project’s licence holder can change the primary establishment.</p></Inset>
                      }
                    </Fragment>
                  )
              }
            </Fragment>
          )
      }
      {
        canTransfer && !review && (
          <Details summary="Why is the establishment I'm looking for not listed?">
            <Inset>
              <p>If the establishment is not listed, ask the Home Office Liaison Contact (HOLC) of that establishment to send you an invitation. Once you accept the invitation, you can request your licence to be transferred.</p>
            </Inset>
          </Details>
        )
      }
    </div>
  );
}
