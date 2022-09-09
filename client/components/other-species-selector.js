import React, { Component, Fragment } from 'react';
import { Button } from '@ukhomeoffice/react-components';

import compact from 'lodash/compact';

import Field from './field';

class OtherSpecies extends Component {
  state = {
    items: this.props.value && this.props.value.length
      ? this.props.value
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
      return this.setState({ items: [null] }, this.save);
    }
    this.setState({
      items: this.state.items.filter((item, i) => i !== index)
    }, this.save);
  }

  save = () => {
    this.props.onFieldChange(`${this.props.name}`, compact(this.state.items));
  }

  render() {
    const { name, label = 'Specify other type of animal' } = this.props;
    const { items } = this.state;

    return (
      <Fragment key={items.length}>
        <h3>{ label }</h3>
        {
          items.map((item, index) => (
            <div key={index} className="flex species-selector-other">
              <div className="grow">
                <Field
                  className="grow"
                  name={`${name}-${index}`}
                  type="text"
                  value={item}
                  onChange={value => this.updateItem(value, index)}
                  noComments={true}
                />
              </div>
              {
                items.length > 1 && (
                  <Button
                    className="link"
                    onClick={() => this.removeItem(index)}
                  >Remove</Button>
                )
              }
            </div>
          ))
        }
        <Button className="button-secondary" onClick={this.addItem}>Add another</Button>
      </Fragment>
    );
  }
}

export default OtherSpecies;
