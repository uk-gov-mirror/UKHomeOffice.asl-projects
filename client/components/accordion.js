import React from 'react';
import every from 'lodash/every';
import castArray from 'lodash/castArray';

class Accordion extends React.Component {

  static defaultProps = {
    scrollToActive: false
  }

  constructor(props) {
    super(props);
    const open = this.props.children.map((child, i) => {
      if (i === this.props.open) {
        return true;
      }
      return false;
    });
    this.state = { open };
  }

  toggle(i) {
    const open = this.state.open;
    if (this.props.openOne) {
      open.forEach((item, index) => {
        if (i !== index) {
          open[index] = false;
        }
      });
    }
    open[i] = !open[i];
    this.setState({ open });
  }

  allOpen() {
    const open = this.state ? this.state.open : [];
    return every(open);
  }

  toggleAll = e => {
    e.preventDefault();
    if (this.allOpen()) {
      return this.setState({ open: this.state.open.map(() => false) });
    }
    return this.setState({ open: this.state.open.map(() => true) });
  }

  advance(i) {
    this.toggle(i);
    if (i + 1 < this.state.open.length) {
      this.toggle(i + 1);
    }
  }

  render() {
    let { closeAll, openAll, openOne, toggleAll = true } = this.props;
    closeAll = closeAll || 'Close all sections';
    openAll = openAll || 'Open all sections';
    return (
      <div className="accordion">
        {
          !openOne && toggleAll && <p className="toggles">
            <a href="#" onClick={this.toggleAll}>{ this.allOpen() ? closeAll : openAll }</a>
          </p>
        }
        {
          castArray(this.props.children).map((child, i) => child && React.cloneElement(child, {
            key: i,
            onToggle: () => this.toggle(i),
            advance: () => this.advance(i),
            open: this.props.pdf || this.state.open[i],
            scrollToActive: this.props.scrollToActive
          }))
        }
        {
          !openOne && toggleAll && <p className="toggles">
            <a href="#" onClick={this.toggleAll}>{ this.allOpen() ? closeAll : openAll }</a>
          </p>
        }
      </div>
    );
  }
}

export default Accordion;
