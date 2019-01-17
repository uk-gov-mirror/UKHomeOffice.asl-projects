import React, { Fragment, Component, PureComponent } from 'react';

import every from 'lodash/every';
import flatten from 'lodash/flatten';

import Wizard from '../../components/wizard';
import Fieldset from '../../components/fieldset';
import Controls from '../../components/controls';
import Complete from '../../components/complete';
import NTS from '../../components/nts';
import Playback from '../../components/playback';
import Link from '../../components/link';

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

  getFields = () => {
    const fields = this.props.fields;
    return fields.filter(field => {
      if (field.show && typeof field.show === 'function') {
        return field.show(this.props.values)
      }
      return true;
    });
  }

  render = () => {
    const { title, fields, values, save, advance, exit, nts, subtitle, intro, linkTo, playback } = this.props;
    const { ntsAccepted } = this.state;
    return (
      <Fragment>
        <h1>{ title }</h1>
        {
          linkTo && <p><Link to={linkTo} /></p>
        }
        {
          playback && <Playback playback={playback} />
        }
        {
          subtitle && <h2>{ subtitle }</h2>
        }
        {
          intro && <p className="grey">{ intro }</p>
        }
        {
          nts && <NTS onAccept={this.toggleAccepted} accepted={ntsAccepted} />
        }
        {
          (!nts || ntsAccepted) && (
            <div ref={this.ref}>
              <Fieldset
                fields={this.getFields()}
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
    const ReviewComponent = props.review || ReviewSection;
    const reviewFields = steps ? flatten(steps.filter(s => !s.repeat).map(s => s.fields)) : fields
    return (
      <Fragment>
        <ReviewComponent
          { ...this.props }
          onEdit={retreat}
          fields={reviewFields}
        />
        <Complete
          className="panel"
          onChange={this.onCompleteChange}
          complete={this.props.values[`${this.props.section}-complete`]}
          label="This section is completed"
        >
          <h2>Mark this section as completed?</h2>
          <p>If you mark a section as completed, you can still come back & edit this section and it will not be submitted to ASRU, all sections in the sections list must be marked as 'Complete'.</p>
        </Complete>
      </Fragment>
    )
  }
}

class Section extends PureComponent {
  showStep = step => {
    if (!step.show) {
      return true;
    }
    return step.show(this.props.values);
  }

  render = () => {
    const { onProgress, exit, step, ...props } = this.props;
    if (!props.values) {
      return null
    }
    const steps = props.steps || [props];

    return (
      <Wizard onProgress={ step => onProgress(step) } step={ step }>
        {
          steps.filter(this.showStep).map((stepSettings, index) => {
            const Component = stepSettings.component || Questions;
            return <Component key={index} exit={exit} step={index} {...props} {...stepSettings} />
          })
        }

        <Review {...props} step={steps.length} onContinue={exit} exit={exit} />
      </Wizard>
    )
  }
}

export default Section
