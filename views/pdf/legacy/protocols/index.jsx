import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import LEGACY_SPECIES from '../../../../client/constants/legacy-species';
import { ReviewTextEditor } from '../../../../client/components/editor/index';
import SummaryTable from './summary-table';

const Field = ({ label, value }) => (
  <Fragment>
    <h3>{ label }</h3>
    {
      value
        ? <ReviewTextEditor value={value} />
        : <p><em>No answer provided</em></p>
    }
  </Fragment>
)

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
      <Field label="Continued use" value={protocol['continued-use']} />
      <Field label="Reuse" value={protocol.reuse} />
      <Field label="Protocol steps" value={protocol.steps} />
      <Field label="Expected adverse effects, refinement controls and humane end-points" value={protocol['adverse-effects']} />
      <h3>Fate of animals not killed at the end of this protocol</h3>
      <dl>
        <dt>Continued use in another protocol under this or another project licence: </dt>
        <dd>{(protocol.fate || []).includes('continued-use') ? 'YES' : 'NO'}</dd>

        <dt>Kept alive at the licenced establishment: </dt>
        <dd>{(protocol.fate || []).includes('kept-alive') ? 'YES' : 'NO'}</dd>

        <dt>Discharge from the controls of the Act by setting free to the wild or by re-homing: </dt>
        <dd>{(protocol.fate || []).includes('rehomed') ? 'YES' : 'NO'}</dd>
      </dl>

      <Field label="Details" value={protocol['fate-justification']} />

      <p className="end">{`( End of protocol ${number} )`}</p>
    </div>
  </div>
)

const PDF = ({ protocols = [] }) => {
  return (
    <Fragment>
      <h1>E. PROTOCOLS</h1>
      <h2 className="subtitle">Summary table</h2>
      <div className="summary-table">
        <SummaryTable protocols={protocols} />
      </div>
      <h2 className="subtitle">Protocol details</h2>
      {
        protocols.map((protocol, index) => <Protocol key={index} protocol={ protocol } number={ index + 1 } />)
      }
    </Fragment>
  )
}

const mapStateToProps = ({ project }) => ({ protocols: project.protocols });

export default connect(mapStateToProps)(PDF);
