import React, { PureComponent, Fragment } from 'react';
import { withRouter } from 'react-router';

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
      editable,
      pdf,
      title
    } = this.props;

    return (
      <Fragment>
        {
          pdf && <h2>{title}</h2>
        }
        { label && <h4>{label}</h4> }
        {
          editable && !values.deleted
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
                prefix={this.props.prefix}
                editLink={`0#${this.props.prefix}`}
                readonly={values.deleted}
              />
            )
        }
      </Fragment>
    );
  }
}

export default withRouter(Section);
