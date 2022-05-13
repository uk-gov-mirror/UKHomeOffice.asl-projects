import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';
import some from 'lodash/some';
import partition from 'lodash/partition';
import { Button } from '@ukhomeoffice/react-components';
import ExpandingPanel from '../expanding-panel';
import AddComment from './add-comment';
import EditComment from './edit-comment';
import Comment from './comment';

class Comments extends Component {
  state = {
    expanded: !this.props.collapsed && some(this.props.comments, comment => comment.isNew),
    showPrevious: false,
    editing: false
  }

  UNSAFE_componentWillReceiveProps(newProps) {
    if (some(newProps.comments, comment => comment.isNew)) {
      this.setState({ expanded: true })
    }
  }

  toggleExpanded = () => {
    this.setState({ expanded: !this.state.expanded });
  }

  toggleShowPrevious = () => {
    this.setState({ showPrevious: !this.state.showPrevious });
  }

  editComment = id => {
    this.setState({ editing: id });
  };

  cancelEdit = () => {
    this.setState({ editing: false });
  };

  render() {
    const { comments = [], commentable, showComments, field } = this.props;
    const { expanded, showPrevious, editing } = this.state;

    if (!showComments) {
      return null;
    }

    if (!comments.length && commentable && !editing) {
      return <AddComment field={field} />
    }

    if (!comments.length) {
      return null;
    }

    const [active, previous] = partition(comments, comment => comment.isNew);
    const commentToEdit = editing && active.find(comment => comment.id === editing);

    return (
      <ExpandingPanel
        alwaysUpdate={true}
        className={classnames('comments', { 'has-new': some(comments, comment => comment.isNew) })}
        open={expanded}
        title={`${expanded ? 'Hide comments' : 'Show comments'} (${comments.length})`}
        onToggle={this.toggleExpanded}
      >
        <Fragment>
          {
            commentable && !editing &&
              <AddComment field={field} />
          }
          {
            commentToEdit &&
              <EditComment field={field} id={commentToEdit.id} key={commentToEdit.id} value={commentToEdit.comment} cancel={this.cancelEdit} />
          }
          {
            active.map((comment, index) => <Comment index={(comments.length || 0) - index - 1} key={(comments.length || 0) - index - 1} field={field} editComment={this.editComment} { ...comment } />)
          }
          {
            !!active.length && !!previous.length && (
              <p><Button className="link" onClick={this.toggleShowPrevious}>{ showPrevious ? 'Hide' : 'Show' } {previous.length} previous comments</Button></p>
            )
          }
          {
            (showPrevious || !active.length) && previous.map((comment, index) => <Comment index={previous.length - index - 1} key={previous.length - index - 1} field={field} { ...comment } />)
          }
        </Fragment>
      </ExpandingPanel>
    )
  }
}

const mapStateToProps = ({ comments, application: { commentable, showComments } }, { field }) => {
  const name = field.split('.').pop();
  let allComments = comments[field];

  // backwards compatibility fixes for some comments being saved without a prefix
  // merge comments saved with unprefixed name and full name
  if (name !== field) {
    // whitelist the fields in legacy protocol animal questions
    if (field.match(/^protocols\.[a-f0-9-]+\.item\./)) {
      allComments = [].concat(comments[name]).concat(comments[field]).filter(Boolean);
    }

    // whitelist the fields nested under the fate section of protocols
    if (field.match(/^protocols\.[a-f0-9-]+\.(killed|killing-method|method-and-justification|continued-use-relevant-project)$/)) {
      allComments = [].concat(comments[name]).concat(comments[field]).filter(Boolean);
    }
  }

  return {
    comments: allComments,
    commentable,
    showComments
  }
};

export default connect(mapStateToProps)(Comments);
