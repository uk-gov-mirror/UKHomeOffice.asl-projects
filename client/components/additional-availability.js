import React, { Fragment } from 'react';
import { useSelector } from 'react-redux';
import { RadioGroup, Warning } from '@ukhomeoffice/react-components';
import { Details, Inset } from '@asl/components';
import Review from './review';

function ReadOnly(props) {
  return (
    <Fragment>
      <p>{props.readOnlyWarning}</p>
      <Review
        {...props}
        value={props.values.name || props.values['establishment-name']}
        readonly={true}
      />
    </Fragment>
  );
}

export default function AdditionalAvailability(props) {
  const { canTransfer, establishments, newApplication } = useSelector(state => state.application);
  const { establishments: additionalEstablishments } = useSelector(state => state.project);

  if (!canTransfer) {
    return <ReadOnly {...props} />
  }

  const name = props.name.replace(props.prefix, '');
  const value = props.values[name];

  const availableEstablishments = establishments.filter(e => {
    return e.id === value || !(additionalEstablishments || []).map(e => e['establishment-id']).includes(e.id)
  });

  const estName = props.values['establishment-name'];

  const freeTextSet = !!estName && !value;

  const label = freeTextSet
    ? 'Confirm this establishment by selecting it from the list'
    : props.label

  return (
    <Fragment>
      {
        freeTextSet && (
          <Review
            label="Additional establishment name"
            hint="Answer provided:"
            value={estName}
            readonly={true}
          />
        )
      }
      {
        availableEstablishments.length === 0 && (
          <Review
            {...props}
            nullValue="No establishments available"
            value={null}
            readonly={true}
          />
        )
      }
      {
        newApplication && <Warning><p>This draft will become instantly visible to staff with oversight of projects at this establishment. Be careful of sharing sensitive information.</p></Warning>
      }
      {
        availableEstablishments.length > 0 && (
          <RadioGroup
            {...props}
            label={label}
            value={value}
            options={[
              {
                label: 'Undecided',
                value: false
              },
              ...availableEstablishments.map(est => {
                return {
                  label: est.name,
                  value: est.id
                };
              })
            ]}
            onChange={e => {
              const val = e.target.value === 'false' ? false : parseInt(e.target.value, 10);
              props.onChange(val);
            }}
          />
        )
      }
      <Details summary="Why is the establishment I need not listed?">
        <Inset>
          <p>You need to be invited to join an establishment before you can request to do work there. Contact your chosen establishment for an invite.</p>
        </Inset>
      </Details>
    </Fragment>
  )
}
