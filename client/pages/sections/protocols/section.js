import React, { PureComponent, Fragment } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import { Button } from '@ukhomeoffice/react-components';

import Fieldset from '../../../components/fieldset'
import ReviewFields from '../../../components/review-fields';

class Section extends PureComponent {
  render() {
    const {
      label,
      fields,
      values,
      onFieldChange,
      prefix,
      advance,
      sectionsLength,
      sectionIndex,
      editable,
      title
    } = this.props;

    return (
      <Fragment>
        { title && <h3>{title}</h3> }
        { label && <h4>{label}</h4> }
        {
          editable
            ? (
              <Fieldset
                fields={fields}
                values={values}
                prefix={prefix}
                onFieldChange={onFieldChange}
              />
            )
            : (
              <ReviewFields
                fields={fields}
                values={values}
                addComment={this.props.addComment}
                prefix={this.props.prefix}
                editLink={`0#${this.props.prefix}`}
              />
            )
        }
        {
          editable && sectionIndex + 1 < sectionsLength && <Button className="button-secondary" onClick={advance}>Next section</Button>
        }
      </Fragment>
    );
  }
}

const mapStateToProps = ({ project }, { index }) => {
  return {
    values: project.protocols[index]
  };
};

export default withRouter(connect(mapStateToProps)(Section));
