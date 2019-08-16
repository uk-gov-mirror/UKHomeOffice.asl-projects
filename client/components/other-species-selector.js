import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
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
      <Fragment key={items.length}>
        {
          items.map((item, index) => (
            <div key={index} className="flex species-selector-other">
              <div className="grow">
                <Field
                  label={index === 0 && label}
                  className="grow"
                  name={`${name}-${index}`}
                  type="text"
                  value={item}
                  onChange={value => this.updateItem(value, index)}
                  noComments={true}
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

const mapStateToProps = ({ project }, { name, values }) => ({
  values: values || project[name]
});

export default connect(mapStateToProps)(OtherSpecies);
