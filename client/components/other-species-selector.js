import React, { Component, Fragment } from 'react';
import { Button } from '@ukhomeoffice/react-components';

import compact from 'lodash/compact';

import Field from './field';

class OtherSpecies extends Component {
  state = {
    items: this.props.values && this.props.values.length
      ? this.props.values
      : [null]
  }

  addItem = () => {
    this.setState({
      items: [ ...this.state.items, null ]
    }, this.save);
  }

  updateItem = (item, index) => {
    const items = [...this.state.items];
    items[index] = item;
    this.setState({ items }, this.save);
  }

  removeItem = index => {
    if (this.state.items.length === 1) {
      return this.setState({ items: [null] }, this.save)
    }
    this.setState({
      items: this.state.items.filter((item, i) => i !== index)
    }, this.save)
  }

  save = () => {
    this.props.onFieldChange(`${this.props.name}`, compact(this.state.items));
  }

  render() {
    const { name, label = 'Which other type of animal will you be using?' } = this.props;
    const { items } = this.state;

    return (
      <Fragment>
        {
          items.map((item, index) => (
            <div key={index} className="flex">
              <div className="grow">
                <Field
                  label={index === 0 && label}
                  className="grow"
                  name={`${name}-${index}`}
                  type="text"
                  value={item}
                  onChange={value => this.updateItem(value, index)}
                />
              </div>
              <Button
                className="shrink"
                onClick={() => this.removeItem(index)}
              >Remove</Button>
            </div>
          ))
        }
        <Button className="button-secondary" onClick={this.addItem}>Add another</Button>
      </Fragment>
    )
  }
}

export default OtherSpecies;