import React, { Component } from 'react';
import classnames from 'classnames';

import { getScrollPos } from '../helpers';

// H2 padding
const OFFSET = -15;

class ExpandingPanel extends Component {

  ref = React.createRef()

  state = {
    open: this.props.open || false
  }

  controlled() {
    return typeof this.props.open === 'boolean';
  }

  toggle () {
    if (this.controlled()) {
      return this.props.onToggle();
    }
    return this.setState({ open: !this.state.open });
  }

  isOpen() {
    if (this.controlled()) {
      return this.props.open;
    }
    return !this.state || this.state.open;
  }

  componentDidUpdate() {
    if (this.props.scrollToActive && this.props.open) {
      this.scrollToTop();
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextProps.open !== this.props.open
      || nextState.open !== this.state.open
  }

  scrollToTop = () => {
    window.scrollTo({
      top: getScrollPos(this.ref.current, OFFSET)
    })
  }

  render() {
    const { children, scrollToActive } = this.props;
    return (
      <section className={classnames('expanding-panel', { open: this.isOpen() }, this.props.className)}>
        <header onClick={() => this.toggle()}>
          <h3 ref={this.ref}>{ this.props.title }</h3>
        </header>
        <div className={classnames('content', { hidden: !this.isOpen() })}>
          {
            scrollToActive
              ? React.Children.map(children, child => React.cloneElement(child, { ...this.props, scrollToTop: this.scrollToTop }))
              : children
          }
        </div>
      </section>
    );
  }
}

export default ExpandingPanel;
