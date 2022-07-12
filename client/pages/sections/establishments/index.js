import React from 'react';
import Establishments from './establishments';
import Controls from '../../../components/controls';
import {shallowEqual, useSelector} from "react-redux";
import {Link} from "@asl/components";

export default function Index({ advance, exit, ...props }) {
  const {
    establishment,
    project: {
      ...project
    }
  } = useSelector(state => state.application, shallowEqual);

  const transferToEstablishmentName = useSelector(state => state.project.transferToEstablishmentName, shallowEqual);

  const isActive = project.status === 'active';

  return (
    <div className="establishments-section">
      <h1>Establishments</h1>
      <p className="larger">Add any additional establishments where work on this project will be carried out beyond just the primary establishment.</p>
      <div className="govuk-form-group">
        <fieldset className="govuk-fieldset inline smaller">
          <legend className="govuk-fieldset__legend">
            <h2 className="govuk-fieldset__heading govuk-heading-l larger">Primary establishment</h2>
          </legend>
          <p className="larger">{transferToEstablishmentName || establishment.name}</p>
          <p className="larger">
            {
              isActive
                ? <Link to="/" label="Change"/>
                : <Link page="project.transferDraft" label="Change" establishmentId={establishment.id} projectId={project.id} />
            }
          </p>
        </fieldset>
      </div>
      <Establishments {...props} editable={true} />
      <Controls onContinue={advance} onExit={exit} />
    </div>
  )
}
