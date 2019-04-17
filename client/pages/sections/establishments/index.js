import React, { Component } from 'react';
import classnames from 'classnames';
import Repeater from '../../../components/repeater';
import Fieldset from '../../../components/fieldset';
import Controls from '../../../components/controls';

const Establishment = ({ prefix, index, fields, updateItem, values, advance, retreat, active, length, goto }) => (
  <div className={classnames({ hidden: index !== active })}>
    <h1>About other establishments - {index + 1} of {length}</h1>
    <div className="playback">
      <dl className="inline">
        <dt>Secondary establishment: </dt>
        <dd>
          <span>{ values.name }</span>
          <a href="#other-establishments-list" onClick={() => goto(0)}>Edit</a>
        </dd>
      </dl>
    </div>
    <Fieldset
      fields={fields}
      values={values}
      prefix={prefix}
      onFieldChange={(key, value) => updateItem({ [key]: value })}
    />
    <Controls onContinue={advance} onExit={retreat} exitLabel="Back" />
  </div>
)

class Establishments extends Component {
  state = {
    active: this.props.active || 0,
  }

  advance = () => {
    if (this.state.active >= (this.props.project.establishments || []).length - 1) {
      return this.props.advance()
    }
    this.setState({
      active: this.state.active + 1
    })
  }

  retreat = () => {
    if (this.state.active === 0) {
      return this.props.retreat();
    }
    return this.setState({
      active: this.state.active - 1
    });
  }

  render() {
    const { save, project, ...props } = this.props;
    const { active } = this.state;

    const items = project.establishments || project['other-establishments-list'].map(name => ({ name }))

    return (
      <Repeater
        items={items}
        addAnother={false}
        onSave={establishments => save({ establishments })}
      >
        <Establishment
          fields={props.fields}
          active={active}
          advance={this.advance}
          retreat={this.retreat}
        />
      </Repeater>
    )
  }
}

export default Establishments;
