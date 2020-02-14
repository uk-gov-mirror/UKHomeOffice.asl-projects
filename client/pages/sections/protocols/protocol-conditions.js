import React, { Component, Fragment } from 'react';
import conditions from '../../../constants/protocol-conditions';
import { Details, Markdown } from '@asl/components';

class Content extends Component {
  render() {
    return (
      <Fragment>
        <div className="purple-inset">
          <Markdown className="condition-text">{conditions.anaesthesia}</Markdown>
        </div>
        <div className="purple-inset">
          <Markdown className="condition-text">{conditions.generalAnaesthesia}</Markdown>
        </div>
        <div className="purple-inset">
          <Markdown className="condition-text">{conditions.surgery}</Markdown>
        </div>
        <div className="purple-inset">
          <Markdown className="condition-text">{conditions.administration}</Markdown>
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
