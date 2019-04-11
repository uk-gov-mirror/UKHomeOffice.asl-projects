import React, { Fragment } from 'react';
import flatten from 'lodash/flatten';
import LEGACY_SPECIES from '../../../../client/constants/legacy-species';

const getSpecies = species => {
  return (LEGACY_SPECIES.find(s => s.value === species) || {}).label;
};

const SummaryTable = ({ protocols }) => (
  <table>
    <thead>
      <tr>
        <th>No.</th>
        <th>Title</th>
        <th>Animal types</th>
        <th>Est. numbers (per project)</th>
        <th>Life stages</th>
        <th>GA?</th>
        <th>Severity category</th>
      </tr>
    </thead>
    <tbody>
      {
        protocols.map((protocol, index) => (
          (protocol.species || []).map((species, speciesIndex) => (
            <tr key={index + speciesIndex}>
              {
                (speciesIndex === 0) && (
                  <Fragment>
                    <td rowSpan={protocol.species.length || 1}>{ index + 1 }</td>
                    <td rowSpan={protocol.species.length || 1}>{ protocol.title }</td>
                  </Fragment>
                )
              }
              <td>{ getSpecies(species) }</td>
              <td>{ protocol[`${species}-quantity`] }</td>
              <td>{ protocol[`${species}-life-stages`] }</td>
              <td>{ protocol[`${species}-genetically-altered`] === true ? 'Yes' : 'No' }</td>
              {
                speciesIndex === 0 && (
                  <td rowSpan={protocol.species.length || 1}>{ protocol.severity }</td>
                )
              }
            </tr>
          ))
        ))
      }
    </tbody>
  </table>
)

export default SummaryTable;
