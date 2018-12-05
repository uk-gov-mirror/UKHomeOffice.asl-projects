import React from 'react';

import Wizard from '../../../components/wizard';

import Questions from './questions';
import Review from './review';

class ExperimentalDesign extends React.Component {

  render() {
    if (!this.props.values) {
      return null;
    }
    return <Wizard onProgress={ step => this.props.onProgress(step) } step={ this.props.step } >
      <Questions { ...this.props } step={0} />
      <Questions { ...this.props } step={1} />
      <Questions { ...this.props } step={2} />
      <Review { ...this.props } />
    </Wizard>;
  }

}

export default ExperimentalDesign;
