import React, { Fragment } from 'react';
import { Button } from '@ukhomeoffice/react-components';

import Banner from '../../../components/banner';
import Review from '../../../components/review';

class ReviewStep extends React.Component {

  edit(step) {
    if (step !== undefined) {
      return this.props.goto(step);
    }
    this.props.retreat();
  }

  render() {
    return <Fragment>
      <Banner>
        <h2>Please review your answers for:</h2>
        <h1>{ this.props.title }</h1>
      </Banner>
      {
        this.props.fields.map(field => {
          return <Review
            { ...field }
            key={ field.name }
            value={ this.props.values[field.name] }
            onEdit={ () => this.edit(field.step) }
            />
        })
      }
      <p className="control-panel">
        <Button onClick={ () => this.props.exit() }>Save and continue</Button>
      </p>
    </Fragment>;
  }

}

export default ReviewStep;
