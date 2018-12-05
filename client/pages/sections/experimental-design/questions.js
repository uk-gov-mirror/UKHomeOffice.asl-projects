import React, { Fragment } from 'react';

import { Button } from '@ukhomeoffice/react-components';
import Field from '../../../components/field';

class Questions extends React.Component {

  render() {
    return <Fragment>
      <h1>{ this.props.title }</h1>
      {
        this.props.fields.filter(field => field.step === this.props.step ).map(field => {
          return <Field
            { ...field }
            key={ field.name }
            value={ this.props.values[field.name] }
            onChange={ value => this.props.save(field.name, value) }
            />
        })
      }
      <p className="control-panel">
        <Button onClick={() => this.props.advance()}>Save and continue</Button>
        <Button onClick={() => this.props.exit()} className="button-secondary">Save and exit</Button>
      </p>
    </Fragment>;
  }

}

export default Questions;
