import React, { Component, Fragment } from 'react';

import Repeater from '../../../components/repeater';
import Fieldset from '../../../components/fieldset';
import Controls from '../../../components/controls';
import Playback from '../../../components/playback';

const Objective = ({ index, fields, length, values, removeItem, updateItem }) => (
  <div className="objective">
    {
      length > 1 && <a href="#" className="float-right" onClick={removeItem}>Remove</a>
    }
    <h2>Objective {index + 1}</h2>
    <Fieldset
      fields={fields}
      values={values}
      onFieldChange={(key, value) => updateItem({ [key]: value })}
    />
  </div>
)

class Objectives extends Component {
  render() {
    if (!this.props.values) {
      return null
    }
    return <Fragment>
      <h1>{ this.props.title }</h1>
      <Playback playback={this.props.playback} />
      <h3>What are your scientific objectives or research questions?</h3>
      <p className="grey">Each objective should be as SMART (specific, measurable, achievable, realistic, time-related) as possible.</p>
      <p className="grey">It should be possible to determine, in five years’ time, whether or not your objectives were met, assuming all lines of enquiry are pursued.</p>
      <Repeater
        items={this.props.values.objectives || []}
        type="objective"
        onSave={objectives => this.props.save({ objectives })}
      >
        <Objective {...this.props}/>
      </Repeater>
      <Controls onContinue={this.props.advance} onExit={this.props.exit} />
    </Fragment>
  }
}

export default Objectives;
