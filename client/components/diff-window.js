import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import isUndefined from 'lodash/isUndefined';
import { fetchQuestionVersions } from '../actions/projects';
import Modal from './modal';
import Review from './review'
import Tabs from './tabs';

class DiffWindow extends React.Component {
  state = {
    active: 0,
    modalOpen: false
  }

  toggleModal = e => {
    e.preventDefault();
    this.setState({ modalOpen: !this.state.modalOpen });
  }

  selectTab = (e, active) => {
    e.preventDefault();
    this.setState({ active })
  }

  componentDidMount() {
    this.props.getPreviousVersions()
  }

  render() {
    const { previous, granted } = this.props;
    const { modalOpen } = this.state;
    return modalOpen
      ? (
        <Modal onClose={this.toggleModal}>
          <div className="diff-window">
            <div className="diff-window-header">
              <h1>Compare</h1>
              <a href="#" className="float-right close" onClick={this.toggleModal}>Close</a>
            </div>
            <div className="diff-window-body">
              <h2>{this.props.label}</h2>
              <div className="govuk-grid-row">
                <div className="govuk-grid-column-one-half">
                  {
                    !isUndefined(previous) && !isUndefined(granted)
                      ? (
                        <Fragment>
                          <Tabs active={this.state.active}>
                            <a href="#" onClick={e => this.selectTab(e, 0)}>Current licence</a>
                            <a href="#" onClick={e => this.selectTab(e, 1)}>Previous version</a>
                          </Tabs>
                          <div className="panel light-grey">
                            <Review
                              options={this.props.options}
                              type={this.props.type}
                              value={this.state.active === 0 ? granted : previous}
                              noComments
                            />
                          </div>
                        </Fragment>
                      )
                      : (
                        <Fragment>
                          <h3>{isUndefined(previous) ? 'Current licence' : 'Previous version'}</h3>
                          <div className="panel light-grey">
                            <Review
                              options={this.props.options}
                              type={this.props.type}
                              value={isUndefined(previous) ? granted : previous}
                              noComments
                            />
                          </div>
                        </Fragment>
                      )
                  }
                </div>
                <div className="govuk-grid-column-one-half">
                  <h3>This version</h3>
                  <div className="panel light-grey">
                    <Review
                      options={this.props.options}
                      type={this.props.type}
                      value={this.props.value}
                      noComments
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="diff-window-footer">
              <h3><a href="#" className="float-right close" onClick={this.toggleModal}>Close</a></h3>
            </div>
          </div>
        </Modal>
      )
      : <a href="#" className="modal-trigger" onClick={this.toggleModal}>Show comparison</a>
  }
}

const mapStateToProps = ({ questionVersions }, { name }) => {
  const { previous, granted } = questionVersions[name] || {}
  return {
    previous,
    granted
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    getPreviousVersions: () => dispatch(fetchQuestionVersions(ownProps.name))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DiffWindow);
