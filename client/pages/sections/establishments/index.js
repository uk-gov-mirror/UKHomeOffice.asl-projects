import React, { Component, Fragment } from 'react';
import classnames from 'classnames';
import castArray from 'lodash/castArray';

import Repeater from '../../../components/repeater';
import Fieldset from '../../../components/fieldset';
import Controls from '../../../components/controls';

const Establishment = ({ index, fields, updateItem, values, advance, retreat, active, length, goto }) => (
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
      onFieldChange={(key, value) => updateItem({ [key]: value })}
    />
    <Controls onContinue={advance} onExit={retreat} exitLabel="Back" />
  </div>
)

class Establishments extends Component {
  otherEstablishments = castArray(this.props.values['other-establishments-list']);

  // if no additional establishments were selected, don't try and use
  // the currently saved establishments as they won't be valid any more
  items = !this.otherEstablishments.length
    ? []
    : (this.props.values.establishments || this.otherEstablishments.map(name => ({ name })))
    .filter(item => this.otherEstablishments.includes(item.name));

  state = {
    active: this.props.active || 0,
    items: this.items
  }

  advance = () => {
    if (this.state.active >= this.state.items.length - 1) {
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
    const { save, ...props } = this.props;
    const { items, active } = this.state;

    if (!items.length) {
      return (
        <Fragment>
          <h2>Please select at least one additional establishment from the list.</h2>
          <button onClick={() => this.retreat()} className="govuk-button button-secondary">Back</button>
        </Fragment>
      );
    }

    return (
<Repeater
  items={items}
  addAnother={false}
  onSave={establishments => {
    console.log(establishments);
    return save({ establishments });
  }}
>
        <Establishment
          { ...props }
          active={active}
          advance={this.advance}
          retreat={this.retreat}
        />
      </Repeater>
    )
  }
}

export default Establishments;
