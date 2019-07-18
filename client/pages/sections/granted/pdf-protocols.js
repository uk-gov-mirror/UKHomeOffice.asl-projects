import React, { Fragment } from 'react';
import ReactMarkdown from 'react-markdown';
import { connect } from 'react-redux';
import SummaryTable from './summary-table';
import ProtocolSections from '../protocols/sections';

const Protocol = ({ protocol, number, sections }) => {
  const species = protocol.speciesDetails.filter(s => s.name);
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
                  <th>Max. no. of animals</th>
                  <th>Max. no. of uses per animal</th>
                  <th>Life stages</th>
                </tr>
              </thead>
              <tbody>
                {
                  species.map(s => (
                    <tr key={s.id}>
                      <td>{ s.name }</td>
                      <td>{ s['maximum-animals'] }</td>
                      <td>{ s['maximum-times-used'] }</td>
                      <td>{ (s['life-stages'] || []).join(', ') }</td>
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

const PDF = ({ protocols = [], granted, ...props }) => {
  return (
    <Fragment>
      <h2>{props.title}</h2>
      <SummaryTable protocols={protocols} />
      <div className="anaesthetic-codes">
        <h2>Anaesthetic codes</h2>
        <ReactMarkdown>{granted.anaesthesia}</ReactMarkdown>
      </div>
      {
        protocols.map((protocol, index) => <Protocol key={index} protocol={ protocol } number={ index + 1 } sections={props.sections} />)
      }
    </Fragment>
  )
}

const mapStateToProps = ({ project }) => ({ protocols: project.protocols });

export default connect(mapStateToProps)(PDF);
