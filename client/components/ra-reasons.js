import React from 'react';
import map from 'lodash/map';

const descriptions = {
  hasCatsDogsEquidae: 'Uses cats, dogs or equidae',
  hasNonHumanPrimates: 'Uses non-human primates',
  hasEndangeredAnimals: 'Uses endangered animals',
  hasSevereProtocols: 'Contains severe procedures',
  isTrainingLicence: 'Education and training licence',
  addedByAsru: 'Required at inspector’s discretion'
};

export default function RaReasons({ reasons }) {
  return (
    <ul>
      {
        map(reasons, (value, key) => (<li key={key}>{descriptions[key]}</li>))
      }
    </ul>
  );
}
