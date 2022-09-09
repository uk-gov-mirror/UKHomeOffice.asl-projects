import React, { Component, Fragment } from 'react';

import Repeater from '../../../components/repeater';
import Fieldset from '../../../components/fieldset';
import Controls from '../../../components/controls';
import Playback from '../../../components/playback';
import { Item } from '../../../components/repeater-field';

class Objectives extends Component {
  render() {
    if (!this.props.values) {
      return null;
    }
    return <Fragment>
      <h1>{ this.props.title }</h1>
      <p className="grey">{this.props.intro}</p>
      <Playback playback={this.props.playback} />
      {
        this.props.values['training-licence']
          ? <h3>What are your teaching objectives?</h3>
          : <h3>What are your scientific objectives or research questions?</h3>
      }
      <p className="grey">Each objective should be as SMART (specific, measurable, achievable, realistic, time-related) as possible.</p>
      <p className="grey">It should be possible to determine, in five years’ time, whether or not your objectives were met, assuming all lines of enquiry are pursued.</p>
      <Repeater
        items={this.props.values.objectives || []}
        type="objectives"
        singular="objective"
        onSave={objectives => this.props.save({ objectives })}
      >
        <Item {...this.props} fields={this.props.fields.filter(f => f.name === 'title')} />
      </Repeater>
      <Fieldset
        fields={this.props.fields.filter(f => !f.objective).filter(f => f.show === undefined || f.show(this.props.values))}
        values={this.props.values}
        onFieldChange={this.props.save}
      />
      <Controls onContinue={this.props.advance} onExit={this.props.exit} />
    </Fragment>;
  }
}

export default Objectives;
