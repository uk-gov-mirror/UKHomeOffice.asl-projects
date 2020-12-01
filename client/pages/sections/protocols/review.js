import React, { Fragment, PureComponent } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Banner from '../../../components/banner';
import Complete from '../../../components/complete';
import Protocols from './protocols';
import ProtocolConditions from './protocol-conditions';

class ProtocolsReview extends PureComponent {
  onCompleteChange = complete => {
    this.props.save('protocols-complete', complete);
    this.props.exit();
  }

  render() {
    const { complete, readonly, isLegacy, ...props } = this.props;
    return (
      <Fragment>
        {
          !readonly && (
            <Banner>
              <h2>Please review your answers for:</h2>
              <h1>Protocols</h1>
            </Banner>
          )
        }

        <Fragment>
          {
            readonly && !isLegacy && (
              <Fragment>
                <p><Link to="/protocol-summary" target="_blank">View summary table (opens in a new tab)</Link></p>
                <ProtocolConditions />
              </Fragment>
            )
          }
          <Protocols {...props} editable={false} />
        </Fragment>

        {
          !readonly && (
            <Complete
              className="panel"
              onChange={this.onCompleteChange}
              complete={complete}
              label="This section is complete"
            >
              <h2>Mark this section as complete?</h2>
              <p>You can still edit this section later, but you will be unable to send this application to the Home Office until all sections are marked as complete.</p>
            </Complete>
          )
        }

      </Fragment>
    );
  }
}

const mapStateToProps = ({ project, application: { readonly } }) => ({
  readonly,
  complete: project['protocols-complete']
});

export default connect(mapStateToProps)(ProtocolsReview);
