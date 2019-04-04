import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import LEGACY_SPECIES from '../../constants/legacy-species';
import { ReviewTextEditor } from '../../components/editor/index'

const Protocol = ({ protocol, number }) => (
  <div className="protocol">
    <h3 className="protocol-number">Protocol {number}</h3>
    <div className="protocol-panel">
      <h2>{ protocol.title }</h2>
      <p><strong>Severity: </strong>{ protocol.severity }</p>
      <table>
        <thead>
          <tr>
            <th>Animal types</th>
            <th>Numbers (per project)</th>
            <th>Life stages</th>
            <th>GA?</th>
          </tr>
        </thead>
        <tbody>
          {
            protocol.species.map(s => (
              <tr key={s}>
                <td>{ (LEGACY_SPECIES.find(lc => lc.value === s) || {}).label }</td>
                <td>{ protocol[`${s}-quantity`] }</td>
                <td>{ protocol[`${s}-life-stages`] }</td>
                <td>{ protocol[`${s}-genetically-altered`] === true ? 'Yes' : 'No' }</td>
              </tr>
            ))
          }
        </tbody>
      </table>
    </div>
    <div className="protocol-content">
      <h2>Continued use</h2>
      <ReviewTextEditor value={protocol['continued-use']} />
      <h2>Reuse</h2>
      <ReviewTextEditor value={protocol.reuse} />
      <h2>Protocol steps</h2>
      <ReviewTextEditor value={protocol.steps} />
      <h2>Expected adverse effects, refinement controls and humane end-points</h2>
      <ReviewTextEditor value={protocol['adverse-effects']} />
      <h2>Fate of animals not killed at the end of this protocol</h2>
      <dl>
        <dt>Continued use in another protocol under this or another project licence: </dt>
        <dd>{(protocol.fate || []).includes('continued-use') ? 'YES' : 'NO'}</dd>

        <dt>Kept alive at the licenced establishment: </dt>
        <dd>{(protocol.fate || []).includes('kept-alive') ? 'YES' : 'NO'}</dd>

        <dt>Discharge from the controls of the Act by setting free to the wild or by re-homing: </dt>
        <dd>{(protocol.fate || []).includes('rehomed') ? 'YES' : 'NO'}</dd>
      </dl>

      <h3>Details</h3>
      <ReviewTextEditor value={1} />

      <p className="end">{`( End of protocol ${number} )`}</p>
    </div>
  </div>
)

const PDF = ({ protocols = [], schemaVersion }) => {
  if (schemaVersion !== 0) {
    console.error('PDF generation is currently only supported for legacy PPLs');
    return null;
  }
  return (
    <Fragment>
      <h1>E. PROTOCOLS</h1>
      <h2 className="protocol-details">Protocol details</h2>
      {
        protocols.map((protocol, index) => <Protocol key={index} protocol={ protocol } number={ index + 1 } />)
      }
    </Fragment>
  )
}

const mapStateToProps = ({ project, application: { schemaVersion } }) => ({
  protocols: project.protocols,
  schemaVersion
});

export default connect(mapStateToProps)(PDF);
