import React from 'react';

import flatten from 'lodash/flatten';

class Wizard extends React.Component {

  advance() {
    const step = Math.min(this.props.step + 1, React.Children.count(this.props.children) - 1);
    this.props.onProgress && this.props.onProgress(step);
  }

  retreat() {
    const step = Math.max(this.props.step - 1, 0);
    this.props.onProgress && this.props.onProgress(step);
  }

  goto(step) {
    step = Math.min(step, this.props.children.length - 1);
    step = Math.max(step, 0);
    this.props.onProgress && this.props.onProgress(step);
  }

  render() {
    const children = flatten(this.props.children);
    const child = children && children[this.props.step];
    if (!child) {
      return null;
    }
    return React.cloneElement(child, {
      advance: () => this.advance(),
      retreat: () => this.retreat(),
      goto: (step) => this.goto(step)
    });
  }

}

Wizard.defaultProps = {
  steps: 0
};

export default Wizard;
