import React, { Fragment, useState } from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { updateRetrospectiveAssessment } from '../actions/projects';
import { Button } from '@ukhomeoffice/react-components';
import Field from './field';
import RAContent from '../constants/retrospective-assessment';

const selector = ({ project, application: { editConditions, raCompulsory } }) => ({ project, editConditions, raCompulsory });

const RetrospectiveAssessmentRequired = ({ showTitle = true }) => {
  return <div className="conditions retrospective-assessment">
    <div className="condition">
      {
        showTitle && <h3>Retrospective assessment</h3>
      }
      <p className="condition-text">{RAContent.required}</p>
    </div>
  </div>;
};

export default function RetrospectiveAssessment({ showTitle = true }) {
  const { project, editConditions, raCompulsory } = useSelector(selector, shallowEqual);

  if (raCompulsory) {
    return <RetrospectiveAssessmentRequired showTitle={ showTitle } />;
  }

  const [isChanging, setIsChanging] = useState(false);
  const [raRequired, setRaRequired] = useState(project.retrospectiveAssessment);
  const dispatch = useDispatch();

  function cancel() {
    setRaRequired(!!project.retrospectiveAssessment);
    setIsChanging(false);
  }

  function onFieldChange(value) {
    setRaRequired(value);
  }

  function save() {
    dispatch(updateRetrospectiveAssessment(raRequired))
      .then(setIsChanging(false));
  }

  return (
    <div className="conditions retrospective-assessment">
      <div className="condition">
        {
          showTitle && <h3>Retrospective assessment</h3>
        }
        {
          isChanging
            ? (
              <Field
                type="radio"
                className="smaller"
                options={[
                  {
                    label: (
                      <Fragment>
                        <h3>This project licence requires a retrospective assessment</h3>
                        <p className="light">{RAContent.required}</p>
                      </Fragment>
                    ),
                    value: true
                  },
                  {
                    label: (
                      <Fragment>
                        <h3>This project licence does not require a retrospective assessment</h3>
                        <p className="light">{RAContent.notRequired}</p>
                      </Fragment>
                    ),
                    value: false
                  }
                ]}
                value={raRequired}
                onChange={onFieldChange}
                noComments
              />
            )
            : (
              <p className="condition-text">
                {
                  raRequired
                    ? RAContent.required
                    : RAContent.notRequired
                }
              </p>
            )
        }
      </div>
      {
        editConditions && (
          <p className="control-panel">
            {
              isChanging
                ? (
                  <Fragment>
                    <Button onClick={save} className="button-secondary">Save</Button>
                    <Button onClick={cancel} className="link">Cancel</Button>
                  </Fragment>
                )
                : <Button onClick={() => setIsChanging(true)} className="link">Change</Button>
            }

          </p>
        )
      }
    </div>
  );
}
