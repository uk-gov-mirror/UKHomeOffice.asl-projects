import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { Button } from '@ukhomeoffice/react-components';
import { fetchQuestionVersions } from '../actions/projects';
import Modal from './modal';
import Review from './review'
import Tabs from './tabs';

class DiffWindow extends React.Component {
  state = {
    active: 0
  }

  selectTab = (e, active) => {
    e.preventDefault();
    this.setState({ active })
  }

  componentDidMount() {
    this.props.getPreviousVersions()
  }

  close = e => {
    e.preventDefault();
    this.props.onClose();
  }

  render() {
    const { previous, granted } = this.props;
    return (
      <Modal onClose={this.props.onClose}>
        <div className="diff-window">
          <div className="diff-window-header">
            <h1>Compare <a href="#" className="float-right" onClick={this.close}>✕</a></h1>
          </div>
          <div className="diff-window-body">
            <h2>{this.props.label}</h2>
            <div className="govuk-grid-row">
              <div className="govuk-grid-column-one-half">
                {
                  previous && granted
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
                            />
                        </div>
                      </Fragment>
                    )
                    : (
                      <Fragment>
                        <h3>{previous ? 'Previous version' : 'Granted licence'}</h3>
                        <div className="panel light-grey">
                          <Review
                            options={this.props.options}
                            type={this.props.type}
                            value={previous ? previous : granted}
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
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="diff-window-footer">
            <h3><a href="#" className="float-right" onClick={this.close}>✕</a></h3>
          </div>
        </div>
      </Modal>
    );
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
