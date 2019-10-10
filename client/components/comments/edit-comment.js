import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { editComment } from '../../actions/comments';
import { Button, TextArea } from '@ukhomeoffice/react-components'

class EditComment extends Component {
  _isMounted = false;

  state = {
    comment: this.props.comment
  };

  onChange = e => {
    const comment = {
      ...this.state.comment,
      comment: e.target.value
    };
    this.setState({ comment });
  }

  onSubmit = () => {
    this.props.editComment({
      field: this.props.field,
      comment: this.state.comment.comment,
      id: this.state.comment.id
    })
      .then(() => {
        if (this._isMounted) {
          this.setState({ comment: null });
          this.props.cancelEdit;
        }
      });
  }

  componentDidMount() {
    this._isMounted = true;
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    const { comment } = this.state;

    if (!comment) {
      return null;
    }

    return (
      <Fragment>
        <TextArea
          label="Edit comment"
          value={comment.comment}
          onChange={this.onChange}
          autoExpand={true}
          name={`edit-comment-${comment.id}`}
          autoFocus
        />
        <p className="control-panel">
          <Button onClick={this.onSubmit}>Save</Button>
          <Button className="link" onClick={this.props.cancelEdit}>Discard changes</Button>
        </p>
      </Fragment>
    );
  }
}

export default connect(null, { editComment })(EditComment);
