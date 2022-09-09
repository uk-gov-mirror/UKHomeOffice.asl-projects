import React, { PureComponent, Fragment } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import Fieldset from '../../../components/fieldset';
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
      title,
      project
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
                fields={fields.filter(f => f.show === undefined || f.show(project))}
                values={values}
                prefix={prefix}
                onFieldChange={onFieldChange}
              />
            )
            : (
              <ReviewFields
                fields={fields.filter(f => f.show === undefined || f.show(project))}
                values={values}
                prefix={prefix}
                editLink={`0#${prefix}`}
                readonly={values.deleted}
              />
            )
        }
      </Fragment>
    );
  }
}

const mapStateToProps = ({ project }) => {
  return { project };
};

export default withRouter(connect(mapStateToProps)(Section));
