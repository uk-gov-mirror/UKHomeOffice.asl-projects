import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';

import ProtocolSections from './protocol-sections';

import Fieldset from '../../../components/fieldset';
import Repeater from '../../../components/repeater';
import Controls from '../../../components/controls';

const Form = ({
  index,
  name,
  updateItem,
  exit,
  toggleActive,
  prefix = '',
  ...props
}) => (
  <div className={classnames('protocol', 'panel')}>
    <h2>{`Protocol ${index + 1}`}</h2>
    <Fieldset
      { ...props }
      fields={props.fields}
      prefix={`${prefix}${name}-${index}-`}
      onFieldChange={(key, value) => updateItem({ [key]: value })}
    />
    <Controls onContinue={toggleActive} onExit={exit} exitDisabled={true} />
  </div>
);

class Protocol extends PureComponent {
  state = {
    active: !this.props.values.title,
    complete: false
  }

  toggleActive = () => {
    this.setState({ active: !this.state.active });
  }

  getProtocolState = () => {
    if (!this.props.editable || !this.props.location.hash) {
      return null;
    }
    const parts = this.props.location.hash.split('.');

    const protocolState = {
      activeProtocol: parseInt(parts[1], 10),
      fieldName: parts[parts.length - 1]
    }
    if (parts.length === 5) {
      protocolState.section = parts[2],
      protocolState.sectionItem = parseInt(parts[3], 10)
    }

    return protocolState;
  }

  isActive = protocolState => {
    if (!protocolState) {
      return false;
    }
    return protocolState.activeProtocol === this.props.index;
  }

  render() {
    const { editable } = this.props;

    const protocolState = this.getProtocolState();
    const isActive = this.isActive(protocolState);

    return editable && this.state.active
      ? <Form
        {...this.props}
        toggleActive={this.toggleActive}
      />
      : <ProtocolSections
          {...this.props}
          protocolState={isActive && protocolState}
          onToggleActive={this.toggleActive}
        />
  }
}

class Protocols extends PureComponent {
  save = protocols => {
    this.props.save({ protocols });
  }

  edit = e => {
    e.preventDefault();
    this.props.retreat();
  }

  render() {
    const { protocols, editable } = this.props;
    return (
      <Repeater
        type="protocol"
        name="protocols"
        items={protocols}
        onSave={this.save}
        addAnother={editable}
        addButtonBefore={protocols && protocols.length > 0 && protocols[0].title}
        addButtonAfter={true}
        onAfterAdd={() => {
          window.scrollTo({
            top: document.body.scrollHeight,
            behavior: 'smooth'
          })
        }}
      >
        <Protocol {...this.props} />
      </Repeater>
    )
  }
}

const mapStateToProps = ({ project: { protocols } }) => ({ protocols });

export default connect(mapStateToProps)(Protocols);
