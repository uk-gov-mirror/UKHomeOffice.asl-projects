import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import flatten from 'lodash/flatten';
import LEGACY_SPECIES from '../../../constants/legacy-species';
import SPECIES from '../../../constants/species';

const getSpecies = (species = [], schemaVersion) => {
  const speciesLabels = schemaVersion === 0 ? LEGACY_SPECIES : flatten(Object.values(SPECIES));
  return species.map(s => (speciesLabels.find(sl => sl.value === s) || {}).label).join(', ')
}

const SummaryTable = ({ protocols, schemaVersion }) => (
  <Fragment>
    <h2>Summary table</h2>
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
            <tr key={index}>
              <td>{ index + 1 }</td>
              <td>{ protocol.title }</td>
              <td>{ getSpecies(protocol.species, schemaVersion) }</td>
            </tr>
          ))
        }
      </tbody>
    </table>
  </Fragment>
)

const mapStateToProps = ({ project, application: { schemaVersion }}) => ({ protocols: project.protocols, schemaVersion })

export default connect(mapStateToProps)(SummaryTable);
