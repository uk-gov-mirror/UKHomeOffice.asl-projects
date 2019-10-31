import React, { Component, Fragment } from 'react';
import ReactMarkdown from 'react-markdown';
import conditions from '../../../constants/protocol-conditions';

class Content extends Component {
  render() {
    return (
      <Fragment>
        <div className="purple-inset">
          <ReactMarkdown className="condition-text">{conditions.anaesthesia}</ReactMarkdown>
        </div>
        <div className="purple-inset">
          <ReactMarkdown className="condition-text">{conditions.generalAnaesthesia}</ReactMarkdown>
        </div>
        <div className="purple-inset">
          <ReactMarkdown className="condition-text">{conditions.surgery}</ReactMarkdown>
        </div>
        <div className="purple-inset">
          <ReactMarkdown className="condition-text">{conditions.administration}</ReactMarkdown>
        </div>
      </Fragment>
    );
  }
}

class ProtocolConditions extends Component {
  render() {
    return (
      <div className="protocol-conditions">
        <h2>General constraints</h2>

        <p>
          Anaesthesia, surgery, substance administration and withdrawal of fluid conditions relate to each of these protocols.
        </p>

        {
          this.props.pdf ? <Content />
          : (
            <details>
              <summary>View general constraints</summary>
              <br />
              <Content />
            </details>
          )
        }
      </div>
    );
  }
}

export default ProtocolConditions;
