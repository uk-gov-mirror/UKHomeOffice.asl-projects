import React, { Component, Fragment } from 'react';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { Button } from '@ukhomeoffice/react-components';

import compact from 'lodash/compact';

import Field from '../components/field';
import Controls from '../components/controls';

import { updateSettings } from '../actions/settings';

class Settings extends Component {
  state = {
    establishments: this.props.establishments || ['']
  }

  addEstablishment = () => {
    this.setState({
      establishments: [
        ...this.state.establishments,
        ''
      ]
    })
  }

  onChange = (index, value) => {
    this.setState({
      establishments: this.state.establishments.map((est, i) => i === index ? value : est)
    })
  }

  remove = index => {
    this.setState({
      establishments: this.state.establishments.filter((est, i) => i !== index)
    })
  }

  save = () => {
    this.props.save('establishments', compact(this.state.establishments))
      .then(() => {
        this.props.history.push('/');
      })
  }

  exit = () => {
    this.props.history.push('/');
  }

  render() {
    const { establishments } = this.state;
    return (
      <Fragment>
        <h1>Settings</h1>
        <h3>Your establishments</h3>
        <span className='govuk-hint'>
          Please add all establishments where your projects may take place. You will be able to define them as primary and additional establishments in each application.
        </span>
        {
          establishments.map((est, index) => (
            <div key={index} className="flex">
              <div className="grow">
                <Field
                  className="grow"
                  name={`establishment-${index}`}
                  type="text"
                  value={est}
                  label={`Establishment ${index + 1}`}
                  onChange={value => this.onChange(index, value)}
                />
              </div>
              { establishments.length > 1 &&
                <Button className="shrink button-secondary" onClick={() => this.remove(index)}>Remove</Button>
              }
            </div>
          ))
        }
        <Button className="button-secondary" onClick={this.addEstablishment}>Add another</Button>
        <Controls
          onContinue={this.save}
          continueDisabled={!compact(this.state.establishments).length}
          exitLabel="Cancel"
          onExit={this.exit}
        />
      </Fragment>
    )
  }
}

const mapStateToProps = state => {
  return {
    establishments: state.settings.establishments
  }
}

const mapDispatchToProps = dispatch => {
  return {
    save: (key, value) => dispatch(updateSettings(key, value))
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Settings))
