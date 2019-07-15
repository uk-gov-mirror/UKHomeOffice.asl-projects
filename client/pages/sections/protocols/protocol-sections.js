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
      newComments,
      readonly
    } = this.props;

    const severityField = sections.details.fields.find(field => field.name === 'severity');
    const severityOption = ((severityField.options || []).find(option => option.value === values.severity) || {}).label;

    const numberOfNewComments = Object.values(newComments)
      .reduce((total, comments) => total + (comments || []).length, 0);

    const speciesDetails = values.speciesDetails && values.speciesDetails.filter(s => s.name);

    const noAnswer = <em>No answer provided</em>;

    return (
      <section className={classnames('protocol', { complete: values.complete || readonly, readonly })}>
        <NewComments comments={numberOfNewComments} />
        <Expandable expanded={this.state.expanded} onHeaderClick={this.toggleExpanded}>
          <Completable status={values.complete ? 'complete' : 'incomplete'}>
            <h2 className="title inline-block">{values.title}</h2>
            {
              editable && <a href="#" className="inline-block" onClick={this.toggleActive}>Edit title</a>
            }
            <dl className="inline">
              <dt>Severity category: </dt>
              <dd className="grey">
                {
                  severityOption
                    ? <strong>{severityOption}</strong>
                    : <em>No answer provided</em>
                }
              </dd>
            </dl>
            {
              values.gaas && <p>This protocol uses genetically altered (GA) animals</p>
            }
            {
              speciesDetails && !!speciesDetails.length && (
                <table className="govuk-table">
                  <thead>
                    <tr>
                      <th>Animal types</th>
                      <th>Est. max. no. of animals</th>
                      <th>Max. no. of uses per animal</th>
                      <th>Life stages</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      speciesDetails.map(species => (
                        <tr key={species.id}>
                          <td>{species.name}</td>
                          <td>{species['maximum-animals'] || noAnswer}</td>
                          <td>{species['maximum-times-used'] || noAnswer}</td>
                          <td>{(species['life-stages'] || []).join(', ') || noAnswer}</td>
                        </tr>
                      ))
                    }
                  </tbody>
                </table>
              )
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
