import React, { PureComponent, Fragment } from 'react';
import { withRouter } from 'react-router';

import classnames from 'classnames';

import Expandable from '../../../components/expandable';
import Completable from '../../../components/completable';
import Complete from '../../../components/complete';
import NewComments from '../../../components/new-comments';
import Sections from './sections';

class ProtocolSections extends PureComponent {
  state = {
    expanded: this.props.editable && (this.props.protocolState || !this.props.values.complete)
  }

  delete = e => {
    e.preventDefault();
    if (window.confirm('Are you sure you want to remove this protocol?')) {
      this.props.removeItem();
    }
  }

  setCompleted = value => {
    this.props.updateItem({ complete: value });
    this.setState({ expanded: !value })
  }

  toggleExpanded = () => {
    this.setState({
      expanded: !this.state.expanded
    })
  }

  toggleActive = e => {
    e.preventDefault();
    this.props.onToggleActive();
  }

  render() {
    const {
      values,
      sections,
      updateItem,
      editable,
      newComments
    } = this.props;

    const severityField = sections.details.fields.find(field => field.name === 'severity');
    const severityOption = severityField.options && severityField.options.find(option => option.value === values.severity);

    const numberOfNewComments = Object.values(newComments)
      .reduce((total, comments) => total + (comments || []).length, 0);

    return (
      <section className={classnames('protocol', { complete: values.complete })}>
        <NewComments comments={numberOfNewComments} />
        <Expandable expanded={this.state.expanded} onHeaderClick={this.toggleExpanded}>
          <Completable status={values.complete ? 'complete' : 'incomplete'}>
            <h2 className="title inline-block">{values.title}</h2>
            {
              editable && <a href="#" className="inline-block" onClick={this.toggleActive}>Edit title</a>
            }
            { severityOption &&
              <dl className="inline">
                <dt>Severity category: </dt>
                <dd className="grey">{severityOption.label}</dd>
              </dl>
            }
          </Completable>
          <div>
            <Sections
              {...this.props}
              onFieldChange={(key, value) => updateItem({ [key]: value })}
            />
            {
              editable && (
                <Fragment>
                  <Complete
                    type="protocol"
                    complete={values.complete}
                    onChange={this.setCompleted}
                    buttonClassName="button-secondary"
                  />
                  <p><a href="#" onClick={this.delete}>Remove this protocol</a></p>
                </Fragment>
              )
            }
          </div>
        </Expandable>
      </section>
    )
  }
}

export default withRouter(ProtocolSections);
