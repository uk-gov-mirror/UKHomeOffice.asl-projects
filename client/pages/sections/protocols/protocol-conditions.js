import React, { Component, Fragment } from 'react';
import ReactMarkdown from 'react-markdown';
import conditions from '../../../constants/protocol-conditions';
import { Details } from '@asl/components';

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
          Anaesthesia, surgery, substance administration and withdrawal of fluid constraints relate to each of these protocols.
        </p>

        {
          this.props.pdf ? <Content />
          : (
            <Details summary="View general constraints">
              <Content />
            </Details>
          )
        }
      </div>
    );
  }
}

export default ProtocolConditions;
