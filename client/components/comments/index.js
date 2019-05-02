import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';
import some from 'lodash/some';
import partition from 'lodash/partition';
import { Button } from '@ukhomeoffice/react-components';
import ExpandingPanel from '../expanding-panel';
import AddComment from './add-comment';
import Comment from './comment';

class Comments extends Component {
  state = {
    expanded: !this.props.collapsed && some(this.props.comments, comment => comment.isNew),
    showPrevious: false
  }

  componentWillReceiveProps(newProps) {
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

  render() {
    const { comments = [], commentable, showComments, field } = this.props;
    const { expanded, showPrevious } = this.state;

    if (!showComments) {
      return null;
    }

    if (!comments.length && commentable) {
      return <AddComment field={field} />
    }

    if (!comments.length) {
      return null;
    }

    const [active, previous] = partition(comments, comment => comment.isNew);

    return (
      <ExpandingPanel
        alwaysUpdate={true}
        className={classnames('comments', { 'has-new': some(comments, comment => comment.isNew) })}
        open={expanded}
        title={expanded ? 'Hide comments' : 'Show comments'}
        onToggle={this.toggleExpanded}
      >
        <Fragment>
          {
            (showPrevious || !active.length) && previous.map((comment, index) => <Comment index={index} key={index} field={field} { ...comment } />)
          }
          {
            !!active.length && !!previous.length && (
              <p><Button className="link" onClick={this.toggleShowPrevious}>{ showPrevious ? 'Hide' : 'Show' } {previous.length} previous comments</Button></p>
            )
          }
          {
            active.map((comment, index) => <Comment index={index + (previous.length || 0)} key={index} field={field} { ...comment } />)
          }
          {
            commentable && <AddComment field={field} />
          }
        </Fragment>
      </ExpandingPanel>
    )
  }
}

const mapStateToProps = ({ comments, application: { commentable, showComments } }, { field }) => ({
  comments: comments[field],
  commentable,
  showComments
});

export default connect(mapStateToProps)(Comments);
