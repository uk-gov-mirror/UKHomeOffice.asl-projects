import React from 'react';
import { connect } from 'react-redux';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

const mapStateToProps = state => {
  return { ...state.message };
}
const mapDispatchToProps = dispatch => {
  return {};
}

class Create extends React.Component {

  alert() {
    if (!this.props.message) {
      return;
    }
    return <div className="alert" key="alert">
      <div className="govuk-width-container">
        <p>{ this.props.message }</p>
      </div>
    </div>;
  }

  render() {
    return <ReactCSSTransitionGroup
      transitionName="alert"
      transitionEnterTimeout={100}
      transitionLeaveTimeout={500}
      >
      { this.alert() }
    </ReactCSSTransitionGroup>;
  }

}

export default connect(mapStateToProps, mapDispatchToProps)(Create);
