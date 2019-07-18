import React, { Fragment } from 'react';
import ReactMarkdown from 'react-markdown';
import { connect } from 'react-redux';
import SummaryTable from './summary-table';
import ProtocolSections from '../protocols/sections';
import LEGACY_SPECIES from '../../../constants/legacy-species';
import LEGAL from '../../../constants/legal';

const Protocol = ({ protocol, number, sections, isLegacy }) => {
  const species = !isLegacy
    ? (protocol.speciesDetails || []).filter(s => s.name)
    : (protocol.species || []).map(s => {
      return {
        ...s,
        name: LEGACY_SPECIES.find(ls => ls.value === s.speciesId).label
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
      <SummaryTable protocols={protocols} isLegacy={isLegacy} />
      <div className="anaesthetic-codes">
        <h2>Anaesthetic codes</h2>
        <ReactMarkdown>{LEGAL.anaesthesia}</ReactMarkdown>
      </div>
      {
        protocols.map((protocol, index) => (
          <Protocol
            key={index}
            protocol={protocol}
            number={index + 1}
            sections={props.sections}
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
  protocols: project.protocols,
  isLegacy: schemaVersion === 0
});

export default connect(mapStateToProps)(PDF);
