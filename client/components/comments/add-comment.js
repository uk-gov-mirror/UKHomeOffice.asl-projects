import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { addComment } from '../../actions/comments';
import { Button, TextArea } from '@ukhomeoffice/react-components'

class AddComment extends Component {
  state = {
    comment: '',
    adding: false
  }

  onChange = e => {
    this.setState({
      comment: e.target.value
    })
  }

  onSubmit = () => {
    this.props.addComment({
      field: this.props.field,
      comment: this.state.comment
    })
      .then(() => this.setState({ comment: '' }));
  }

  toggleAdding = () => {
    this.setState({ adding: !this.state.adding });
  }

  clear = () => {
    this.setState({ comment: '', adding: false });
  }

  render() {
    const { comment, adding } = this.state;
    return adding
      ? (
        <Fragment>
          <TextArea type="textarea" label="Add new comment" value={comment} onChange={this.onChange} />
          <p className="control-panel">
            <Button onClick={this.onSubmit}>Save</Button>
            <Button className="link" onClick={this.clear}>Discard</Button>
          </p>
        </Fragment>
      )
      : <Button className="button-secondary" onClick={this.toggleAdding}>Add comment</Button>
  }
}

export default connect(null, { addComment })(AddComment);
