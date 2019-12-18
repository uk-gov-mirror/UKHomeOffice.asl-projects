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
    return <ReviewField {...this.props} />;
  }

  render() {
    const { label } = this.props.altLabels ? this.props.alt : this.props;
    const { hint, isGranted, showGrantedLabel = true, review } = this.props;
    return (
      <div className="review">
        {
          (!isGranted || showGrantedLabel) && <h3>{review || label}</h3>
        }
        <ChangedBadge
          changedFromLatest={this.props.changedFromLatest}
          changedFromGranted={this.props.changedFromGranted}
          protocolId={this.props.protocolId}
        />
        {
          this.props.readonly && (this.props.changedFromLatest || this.props.changedFromGranted) && (
            <DiffWindow
              {...this.props}
              changedFromLatest={this.props.changedFromLatest}
              changedFromGranted={this.props.changedFromGranted}
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
          !this.props.noComments && <Comments field={`${this.props.prefix || ''}${this.props.name}`} collapsed={!this.props.readonly} />
        }
        {
          !this.props.readonly && (
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
