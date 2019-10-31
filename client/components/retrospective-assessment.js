import React, { Fragment, useState } from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { updateRetrospectiveAssessment } from '../actions/projects';
import intersection from 'lodash/intersection';
import some from 'lodash/some';
import values from 'lodash/values';
import flatten from 'lodash/flatten';
import isUndefined from 'lodash/isUndefined';
import isPlainObject from 'lodash/isPlainObject';
import { Button } from '@ukhomeoffice/react-components';
import Field from './field';
import RAContent from '../constants/retrospective-assessment';
import SPECIES from '../constants/species';

const species = flatten(values(SPECIES));

const nopes = [
  // legacy
  'prosimians',
  'marmosets',
  'cynomolgus',
  'rhesus',
  // legacy
  'vervets',
  // legacy
  'baboons',
  // legacy
  'squirrel-monkeys',
  // legacy
  'other-old-world',
  // legacy
  'other-new-world',
  'other-nhps',
  // legacy
  'apes',
  'beagles',
  'other-dogs',
  'cats',
  'horses'
];

function raApplies(project) {
  return !!intersection(project.species, nopes).length ||
    !!intersection(project['species-other'], nopes.map(n => (species.find(s => s.value === n) || {}).value)).length ||
    project['endangered-animals'] ||
    some(project.protocols, p => (p.severity || '').match(/severe/ig));
}

function getInitialState(project) {
  if (!isUndefined(project.retrospectiveAssessment)) {
    // legacy licences may have an object containing a boolean/
    if (isPlainObject(project.retrospectiveAssessment)) {
      return project.retrospectiveAssessment['retrospective-assessment-required'];
    }
    // now saved as a boolean
    return !!project.retrospectiveAssessment;
  }
  // previous new licences contained a 'retrospective-assessment' condition.
  if (project.conditions && project.conditions.find(c => c.key.match(/^retrospective-assessment$/))) {
    return true;
  }
  return false;
}

const selector = ({ project, application: { editConditions } }) => ({ project, editConditions });

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
  const { project, editConditions } = useSelector(selector, shallowEqual);
  const required = raApplies(project);

  if (required) {
    return <RetrospectiveAssessmentRequired showTitle={ showTitle } />;
  }

  const [isChanging, setIsChanging] = useState(false);
  const [raRequired, setRaRequired] = useState(getInitialState(project));
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
  )
}
