import React, { Fragment } from 'react';
import { HashLink as Link } from 'react-router-hash-link';
import { connect } from 'react-redux';

import Comments from './comments';
import DiffWindow from './diff-window';
import ReviewField from './review-field';
import ChangedBadge from './changed-badge';

import ErrorBoundary from './error-boundary';

class Review extends React.Component {

  replay() {
    return this.props.children || <ReviewField {...this.props} />;
  }

  render() {
    const { label } = this.props.altLabels ? this.props.alt : this.props;
    const {
      hint,
      isGranted,
      showGrantedLabel = true,
      review,
      changedFromLatest,
      changedFromGranted,
      hideChanges
    } = this.props;
    const showComments = !this.props.noComments && this.props.type !== 'repeater';
    const changed = changedFromLatest || changedFromGranted;
    const showDiffWindow = this.props.readonly && !hideChanges && changed
    const showChanges = !hideChanges && changed;

    return (
      <div className="review">
        {
          (!isGranted || showGrantedLabel) && <h3>{review || label}</h3>
        }
        {
          showChanges && (
            <ChangedBadge
              changedFromLatest={changedFromLatest}
              changedFromGranted={changedFromGranted}
              protocolId={this.props.protocolId}
            />
          )
        }
        {
          showDiffWindow && (
            <DiffWindow
              {...this.props}
              changedFromLatest={changedFromLatest}
              changedFromGranted={changedFromGranted}
              name={`${this.props.prefix}${this.props.name}`}
            />
          )
        }
        {
          hint && <p className="grey">{hint}</p>
        }
        {
          this.replay()
        }
        {
          showComments && <Comments field={`${this.props.prefix || ''}${this.props.name}`} collapsed={!this.props.readonly} />
        }
        {
          // repeaters have edit links on the individual fields
          !this.props.readonly && this.props.type !== 'repeater' && (
            <Fragment>
              <p>
                <Link
                  to={this.props.editLink || `#${this.props.name}`}
                  className="edit-link"
                  onClick={e => this.props.onEdit && this.props.onEdit(e, this.props.name)}
                  >Edit</Link>
              </p>
              <hr />
            </Fragment>
          )
        }
      </div>
    );
  }
}


const mapStateToProps = ({ application: { readonly, isGranted, previousProtocols } = {}, changes : { latest = [], granted = [] } = {} }, ownProps) => {
  const key = `${ownProps.prefix || ''}${ownProps.name}`;
  const changedFromGranted = granted.includes(key);
  const changedFromLatest = latest.includes(key);
  return {
    readonly: ownProps.readonly || readonly,
    changedFromLatest,
    changedFromGranted,
    isGranted,
    previousProtocols
  };
}

const ConnectedReview = connect(mapStateToProps)(Review)

const SafeReview = props => (
  <ErrorBoundary
    details={`Field: ${props.name}`}
  >
    <ConnectedReview {...props} />
  </ErrorBoundary>
);

export default SafeReview;
