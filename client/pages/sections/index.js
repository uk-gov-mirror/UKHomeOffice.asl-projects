import React, { Fragment, Component, PureComponent } from 'react';

import every from 'lodash/every';
import flatten from 'lodash/flatten';

import Wizard from '../../components/wizard';
import Fieldset from '../../components/fieldset';
import Controls from '../../components/controls';
import Complete from '../../components/complete';
import NTS from '../../components/nts';

import ReviewSection from './review';

class Questions extends PureComponent {
  state = {
    ntsAccepted: !this.props.nts || every(this.props.fields, field => this.props.values[field.name])
  }

  ref = React.createRef()

  toggleAccepted = () => {
    this.setState({ ntsAccepted: !this.state.ntsAccepted }, this.scrollToElement);
  }

  scrollToElement = () => {
    window.scrollTo({
      top: this.ref.current.offsetTop,
      behavior: 'smooth'
    });
  }

  render = () => {
    const { title, fields, values, save, advance, exit, nts, subtitle } = this.props;
    const { ntsAccepted } = this.state;
    return (
      <Fragment>
        <h1>{ title }</h1>
        {
          subtitle && <h2>{ subtitle }</h2>
        }
        {
          nts && <NTS onAccept={this.toggleAccepted} accepted={ntsAccepted} />
        }
        {
          (!nts || ntsAccepted) && (
            <div ref={this.ref}>
              <Fieldset
                fields={fields}
                values={values}
                onFieldChange={save}
              />
              <Controls onContinue={advance} onExit={exit} />
            </div>
          )
        }
      </Fragment>
    )
  }
}

class Review extends Component {
  onCompleteChange = complete => {
    this.props.save(`${this.props.section}-complete`, complete);
    this.props.exit();
  }

  render = () => {
    const { save, retreat, steps, fields, ...props } = this.props;

    return (
      <Fragment>
        <ReviewSection
          { ...props }
          onEdit={retreat}
          fields={steps ? flatten(steps.map(s => s.fields)) : fields}
        />
        <Complete className="panel" onChange={this.onCompleteChange} complete={this.props.values[`${this.props.section}-complete`]}>
          <h2>Mark this section as completed?</h2>
          <p>If you mark a section as completed, you can still come back & edit this section and it will not be submitted to ASRU, all sections in the sections list must be marked as 'Complete'.</p>
        </Complete>
      </Fragment>
    )
  }
}

class Section extends PureComponent {
  render = () => {
    const { onProgress, exit, step, ...props } = this.props;
    if (!props.values) {
      return null
    }
    const steps = props.steps || [props];
    return (
      <Wizard onProgress={ step => onProgress(step) } step={ step }>
        {
          steps.map((stepSettings, index) => (
            <Questions key={index} exit={exit} step={index} {...props} {...stepSettings} />
          ))
        }

        <Review {...props} step={steps.length} onContinue={exit} exit={exit} />
      </Wizard>
    )
  }
}

export default Section
