import React, { Fragment } from 'react';
import LEGACY_SPECIES from '../../../constants/legacy-species';

const SummaryTable = ({ protocols, isLegacy }) => (
  <div className="summary-table">
    <h3>Summary table</h3>
    <table>
      <thead>
        <tr>
          <th>No.</th>
          <th>Protocol</th>
          <th>Animal types</th>
          {
            isLegacy
              ? <th>Est. numbers</th>
              : (
                <Fragment>
                  <th>Max. no. of animals</th>
                  <th>Max. no. of uses per animal</th>
                </Fragment>
              )
          }
          <th>Life stages</th>
          <th>GA?</th>
          <th>Severity category</th>
        </tr>
      </thead>
      <tbody>
        {
          (protocols || []).map((protocol, index) => {
            const species = !isLegacy
              ? (protocol.speciesDetails || []).filter(s => s.name)
              : (protocol.species || []).map(s => {
                const matched = LEGACY_SPECIES.find(ls => ls.value === s.speciesId);
                return {
                  ...s,
                  name: matched ? matched.label : '-'
                };
              });
            return species.map((s, speciesIndex) => (
              <tr key={index + speciesIndex}>
                {
                  (speciesIndex === 0) && (
                    <Fragment>
                      <td rowSpan={species.length || 1}>{ index + 1 }</td>
                      <td rowSpan={species.length || 1}>{ protocol.title }</td>
                    </Fragment>
                  )
                }
                <td>{ s.name }</td>
                {
                  isLegacy
                    ? <td>{s.quantity}</td>
                    : (
                      <Fragment>
                        <td>{ s['maximum-animals'] }</td>
                        <td>{ s['maximum-times-used'] }</td>
                      </Fragment>
                    )
                }
                <td>
                  {
                    isLegacy
                      ? s['life-stages']
                      : (s['life-stages'] || []).join(', ')
                    }
                </td>
                {
                  isLegacy && <td>{s['genetically-altered'] === true ? 'Yes' : 'No'}</td>
                }
                {
                  speciesIndex === 0 && (
                    <Fragment>
                      {
                        !isLegacy && <td rowSpan={species.length || 1}>{ protocol.gaas === true ? 'Yes' : 'No' }</td>
                      }
                      <td rowSpan={species.length || 1}>{ protocol.severity }</td>
                    </Fragment>
                  )
                }
              </tr>
            ))
          })
        }
      </tbody>
    </table>
  </div>
)

export default SummaryTable;
