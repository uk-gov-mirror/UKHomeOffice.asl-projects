import React, { Fragment } from 'react';

const SummaryTable = ({ protocols }) => (
  <div className="summary-table">
    <h3>Summary table</h3>
    <table>
      <thead>
        <tr>
          <th>No.</th>
          <th>Protocol</th>
          <th>Animal types</th>
          <th>Max. no. of animals</th>
          <th>Max. no. of uses per animal</th>
          <th>Life stages</th>
          <th>GA?</th>
          <th>Severity category</th>
        </tr>
      </thead>
      <tbody>
        {
          protocols.map((protocol, index) => (
            (protocol.speciesDetails || []).map((species, speciesIndex) => (
              <tr key={index + speciesIndex}>
                {
                  (speciesIndex === 0) && (
                    <Fragment>
                      <td rowSpan={protocol.speciesDetails.length || 1}>{ index + 1 }</td>
                      <td rowSpan={protocol.speciesDetails.length || 1}>{ protocol.title }</td>
                    </Fragment>
                  )
                }
                <td>{ species.name }</td>
                <td>{ species['maximum-animals'] }</td>
                <td>{ species['maximum-times-used'] }</td>
                <td>{ (species['life-stages'] || []).join(', ') }</td>
                {
                  speciesIndex === 0 && (
                    <Fragment>
                      <td rowSpan={protocol.speciesDetails.length || 1}>{ protocol.gaas === true ? 'Yes' : 'No' }</td>
                      <td rowSpan={protocol.speciesDetails.length || 1}>{ protocol.severity }</td>
                    </Fragment>
                  )
                }
              </tr>
            ))
          ))
        }
      </tbody>
    </table>
  </div>
)

export default SummaryTable;
