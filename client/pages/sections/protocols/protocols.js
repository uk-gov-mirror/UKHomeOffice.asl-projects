import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';

import pickBy from 'lodash/pickBy';
import mapKeys from 'lodash/mapKeys';

import ProtocolSections from './protocol-sections';

import Fieldset from '../../../components/fieldset';
import Repeater from '../../../components/repeater';
import Controls from '../../../components/controls';

import { getNewComments, getConditions } from '../../../helpers';
import CONDITIONS from '../../../constants/conditions';

const Form = ({
  index,
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
      prefix={prefix}
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
      activeProtocol: parts[1],
      fieldName: parts[parts.length - 1]
    }
    if (parts.length === 5) {
      protocolState.section = parts[2],
      protocolState.sectionItem = parts[3]
    }

    return protocolState;
  }

  isActive = protocolState => {
    if (!protocolState) {
      return false;
    }
    return protocolState.activeProtocol === this.props.values.id;
  }

  render() {
    const { editable } = this.props;

    const newComments = mapKeys(
      pickBy(this.props.newComments, (comments, key) => {
        const re = new RegExp(`^protocol.${this.props.values.id}`);
        return key.match(re);
      }),
      (value, key) => key.replace(`protocol.${this.props.values.id}.`, '')
    );

    const protocolState = this.getProtocolState();
    const isActive = this.isActive(protocolState);

    return editable && this.state.active
      ? <Form
        {...this.props}
        toggleActive={this.toggleActive}
      />
      : <ProtocolSections
          {...this.props}
          newComments={newComments}
          protocolState={isActive && protocolState}
          onToggleActive={this.toggleActive}
        />
  }
}

class Protocols extends PureComponent {
  save = protocols => {
    if (!this.props.readonly) {
      protocols = protocols.map(protocol => {
        const conds = getConditions(protocol, CONDITIONS.protocol, this.props.project);
        if (conds) {
          return {
            ...protocol,
            conditions: conds
          }
        }
        return protocol;
      });
    }
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
        type="protocols"
        singular="protocol"
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

const mapStateToProps = ({ comments, project: { protocols }, application: { user, readonly } }) => ({ protocols, newComments: getNewComments(comments, user), readonly });

export default connect(mapStateToProps)(Protocols);
