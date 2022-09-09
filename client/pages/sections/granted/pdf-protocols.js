import React, { Fragment } from 'react';
import classnames from 'classnames';
import { connect } from 'react-redux';
import SummaryTable from './summary-table';
import ProtocolSections from '../protocols/sections';
import ProtocolConditions from '../protocols/protocol-conditions';
import { getLegacySpeciesLabel } from '../../../helpers';
import { filterSpeciesByActive } from '../protocols/animals';

function uppercaseFirst(str) {
  return `${str.charAt(0).toUpperCase()}${str.substring(1)}`;
}

export function Protocol({ protocol, number, sections, isLegacy, project, children, className }) {
  const species = !isLegacy
    ? filterSpeciesByActive(protocol, project)
    : (protocol.species || []).map(s => {
      const label = getLegacySpeciesLabel(s);
      return {
        ...s,
        name: label || '-'
      };
    });
  return (
    <table className={classnames('protocol', className)}>
      <thead>
        <tr>
          <th>
            <div className="protocol-number-wrapper">
              <h3 className="protocol-number">Protocol {number}</h3>
              <h3 className="protocol-number-continued">Protocol {number} continued</h3>
            </div>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            <div className="border-extension"></div>
            <h3 className="hide-protocol-number-continued">Protocol {number} continued</h3>
            <div className="container">
              <h2 className="protocol-title">{ protocol.title || 'Untitled protocol' }</h2>
              <div className="larger-font">
                <p><strong>Severity: </strong>{ protocol.severity ? uppercaseFirst(protocol.severity) : <em>No answer provided</em> }</p>
                {
                  protocol.gaas && <p>This protocol uses genetically altered (GA) animals</p>
                }
              </div>
              {
                !!species.length && (
                  <table className="species-summary">
                    <thead>
                      <tr>
                        <th>Animal types</th>
                        {
                          isLegacy
                            ? <th>Est. numbers</th>
                            : (
                              <Fragment>
                                <th>Max number of animals</th>
                                <th>Max uses per animal</th>
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
              {
                children
              }
              {
                sections && (
                  <div className="protocol-content">
                    <ProtocolSections values={protocol} sections={sections} pdf={true} number={number} prefix={`protocols.${protocol.id}.`} />
                  </div>
                )
              }
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  );
}

const PDF = ({ protocols = [], isLegacy, ...props }) => {
  const showConditions = !isLegacy;
  return (
    <Fragment>
      {
        !isLegacy && <h2>{props.title}</h2>
      }
      <div className="summary-table">
        <h3>Summary table</h3>
        <div className="container">
          <SummaryTable protocols={protocols} isLegacy={isLegacy} project={props.project} />
        </div>
      </div>
      {
        showConditions && <ProtocolConditions pdf={true} />
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
  );
};

const mapStateToProps = ({
  project,
  application: { schemaVersion, isFullApplication }
}) => ({
  protocols: (project.protocols || []).filter(protocol => !protocol.deleted),
  isLegacy: schemaVersion === 0,
  project,
  isFullApplication
});

export default connect(mapStateToProps)(PDF);
