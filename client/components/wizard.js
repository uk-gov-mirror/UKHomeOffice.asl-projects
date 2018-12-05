import React, { Fragment } from 'react';

class Wizard extends React.Component {

  componentDidMount() {
    this.setState({ step: this.props.step || 0 });
  }

  advance() {
    const step = Math.min(this.state.step + 1, this.props.children.length - 1);
    this.setState({ step });
    this.props.onProgress && this.props.onProgress(step);
  }

  retreat() {
    const step = Math.max(this.state.step - 1, 0);
    this.setState({ step });
    this.props.onProgress && this.props.onProgress(step);
  }

  goto(step) {
    step = Math.min(step, this.props.children.length - 1);
    step = Math.max(step, 0);
    this.setState({ step });
    this.props.onProgress && this.props.onProgress(step);
  }

  render() {
    if (!this.state) {
      return null;
    }
    const child = this.props.children && this.props.children[this.state.step];
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

export default Wizard;
