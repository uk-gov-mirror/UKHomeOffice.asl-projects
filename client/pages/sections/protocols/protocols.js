import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';

import size from 'lodash/size';
import ProtocolSections from './protocol-sections';

import Fieldset from '../../../components/fieldset';
import Repeater from '../../../components/repeater';
import Controls from '../../../components/controls';

class Form extends PureComponent {
  removeItem = e => {
    e.preventDefault();
    this.props.removeItem();
  }

  render() {
    const { index, name, updateItem, exit, toggleActive, prefix = '', ...props } = this.props;
    return (
      <div className={classnames('protocol', 'panel')}>
        {
          index !== 0 && (
            <a href="#" className="float-right" onClick={this.removeItem}>Remove</a>
          )
        }

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
  }
}

class Protocol extends PureComponent {
  state = {
    active: !this.props.values.title,
    complete: false
  }

  toggleActive = () => {
    this.setState({ active: !this.state.active });
  }

  getParts = () => {
    if (!this.props.editable || !this.props.location.hash) {
      return null;
    }
    const parts = this.props.location.hash.split('.');
    if (!parts.length) {
      return null;
    }
    return parts;
  }

  isActive = parts => {
    if (!parts) {
      return false;
    }
    const active = parseInt(parts[1], 10);
    return isNaN(active) ? false : active === this.props.index;
  }

  render() {
    const { editable } = this.props;

    const parts = this.getParts();
    const isActive = this.isActive(parts);

    return editable && this.state.active
      ? <Form
        {...this.props}
        toggleActive={this.toggleActive}
      />
      : <ProtocolSections
          {...this.props}
          parts={isActive && parts}
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
    const { project, editable } = this.props;
    if (!size(project)) {
      return null;
    }
    return (
      <Repeater
        type="protocol"
        name="protocols"
        items={project.protocols}
        onSave={this.save}
        addAnother={editable}
        addButtonBefore={project.protocols && project.protocols.length > 0 && project.protocols[0].title}
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

const mapStateToProps = ({ project }) => ({ project });

export default connect(mapStateToProps)(Protocols);
