import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import SummaryTable from './summary-table';
import ProtocolSections from '../protocols/sections';
import ProtocolConditions from '../protocols/protocol-conditions';
import { getLegacySpeciesLabel } from '../../../helpers';
import { filterSpeciesByActive } from '../protocols/animals';

const Protocol = ({ protocol, number, sections, isLegacy, project }) => {
  const species = !isLegacy
    ? filterSpeciesByActive(protocol, project)
    : (protocol.species || []).map(s => {
      const label = getLegacySpeciesLabel(s);
      return {
        ...s,
        name: label || '-'
      }
    });
  return (
    <div className="protocol">
      <h3 className="protocol-number">Protocol {number}</h3>
      <div className="protocol-panel">
        <h2>{ protocol.title || 'Untitled protocol' }</h2>
        <p><strong>Severity: </strong>{ protocol.severity || <em>No answer provided</em> }</p>
        {
          protocol.gaas && <p>This protocol uses genetically altered (GA) animals</p>
        }
        {
          !!species.length && (
            <table>
              <thead>
                <tr>
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
                </tr>
              </thead>
              <tbody>
                {
                  species.map(s => (
                    <tr key={s.id}>
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
                    </tr>
                  ))
                }
              </tbody>
            </table>
          )
        }
      </div>
      <div className="protocol-content">
        <ProtocolSections values={protocol} sections={sections} pdf={true} number={number} />
        <p className="end">{`( End of protocol ${number} )`}</p>
      </div>
    </div>
  )
}

const PDF = ({ protocols = [], isLegacy, ...props }) => {
  return (
    <Fragment>
      {
        !isLegacy && <h2>{props.title}</h2>
      }
      <div className="summary-table">
        <h3>Summary table</h3>
        <SummaryTable protocols={protocols} isLegacy={isLegacy} project={props.project} />
      </div>
      {
        !isLegacy && <ProtocolConditions pdf={true} />
      }
      {
        protocols.map((protocol, index) => (
          <Protocol
            key={index}
            protocol={protocol}
            number={index + 1}
            sections={props.sections}
            project={props.project}
            isLegacy={isLegacy}
          />
        ))
      }
    </Fragment>
  )
}

const mapStateToProps = ({
  project,
  application: { schemaVersion }
}) => ({
  protocols: (project.protocols || []).filter(protocol => !protocol.deleted),
  isLegacy: schemaVersion === 0,
  project
});

export default connect(mapStateToProps)(PDF);
