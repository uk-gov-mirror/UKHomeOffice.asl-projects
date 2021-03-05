import React from 'react';
import { useSelector } from 'react-redux';
import map from 'lodash/map';
import isEmpty from 'lodash/isEmpty';
import { getReasons } from '../helpers/retrospective-assessment';
import { formatDate } from '../helpers';
import { DATE_FORMAT } from '../constants';

const descriptions = {
  hasCatsDogsEquidae: 'Uses cats, dogs or equidae',
  hasNonHumanPrimates: 'Uses non-human primates',
  hasEndangeredAnimals: 'Uses endangered animals',
  hasSevereProtocols: 'Contains severe procedures',
  isTrainingLicence: 'Education and training licence',
  addedByAsru: 'Required at inspector’s discretion'
};

export default function RaDetails() {
  const { project, grantedVersion } = useSelector(state => state.application);
  let reasons = getReasons(grantedVersion.data);

  console.log(project.versions);

  // if (isEmpty(reasons)) {
  //   const oldReasons = project.versions
  //     .slice(1)
  //     .filter(oldVersion => oldVersion.status === 'granted')
  //     .reduce((result, oldVersion) => {
  //       const r = getReasons(oldVersion.data);
  //       if (!isEmpty(r)) {
  //         result = Object.assign({}, result, r); // merge the results
  //       }
  //       return result;
  //     }, {});

  //   console.log({oldReasons});

  //   reasons = oldReasons;
  // }

  return (
    <div className="ra-details gutter">
      <dl className="inline">
        <dt>Retrospective assessment due</dt>
        <dd>{formatDate(project.raDate, DATE_FORMAT.long)}</dd>

        <dt>Reason for retrospective assessment</dt>
        <dd>
          <ul>
            {
              map(reasons, (value, key) => (<li key={key}>{descriptions[key]}</li>))
            }
          </ul>
        </dd>
      </dl>
    </div>
  )
}
