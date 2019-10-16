import React, { Component } from 'react';
import Banner from './banner';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      info: null
    };
  }

  componentDidCatch(error, info) {
    this.setState({ error, info });
  }

  render() {
    const {
      message = 'Something went wrong',
      section = false,
      details
    } = this.props;
    const { error, info } = this.state;
    if (error) {
      return (
        <Banner className="error">
          {
            section
              ? <h1>{ message }</h1>
              : <h3>{ message }</h3>
          }
          <details>
            <summary>Error details:</summary>
            <p>{ details }</p>
            <pre>
              { error.stack }
              <br />
              { info.componentStack }
            </pre>
          </details>
        </Banner>
      );
    }
    return this.props.children;
  }
}
