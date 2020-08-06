import React, { Fragment, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector, shallowEqual } from 'react-redux';
import { TrainingSummary } from '@asl/components';
import { Button } from '@ukhomeoffice/react-components';
import Fieldset from '../../components/fieldset';
import ReviewFields from '../../components/review-fields';

export default function Training(props) {
  const { training, basename, readonly } = useSelector(state => state.application, shallowEqual);
  const project = useSelector(state => state.project);
  const form = useRef(null);
  const history = useHistory();
  const trainingComplete = project['training-complete'];

  function onSubmit(e) {
    e.preventDefault();
    if (trainingComplete) {
      return history.push('/');
    }
    form.current.submit();
  }

  return (
    <Fragment>
      <h1>Training</h1>
      <p>{props.intro}</p>
      <h2>Training record</h2>
      <TrainingSummary certificates={readonly ? project.training : training} />
      {
        readonly
          ? <ReviewFields {...props} />
          : (
            <form
              ref={form}
              action={`${basename}/update-training`}
              onSubmit={onSubmit}
              method="POST"
            >

              <Fieldset
                {...props}
                values={{ 'training-update': needsUpdate }}
                onFieldChange={props.save}
              />
              <Button>Continue</Button>
            </form>
          )
      }

    </Fragment>
  )
}
