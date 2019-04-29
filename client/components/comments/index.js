import React, { Component, Fragment } from 'react';
import classnames from 'classnames';
import ReactMarkdown from 'react-markdown';
import { connect } from 'react-redux';
import format from 'date-fns/format';
import some from 'lodash/some';
import partition from 'lodash/partition';
import { Button } from '@ukhomeoffice/react-components';
import ExpandingPanel from '../expanding-panel';
import AddComment from './add-comment';

const Comment = ({ author, createdAt, comment, index, isNew, user }) => (
  <div className={classnames('comment', { isNew, mine: user === author })}>
    <div className="header">
      <strong>{`${index + 1}. ${author}`}</strong>
      <span className="float-right">{ createdAt ? format(createdAt, 'DD/MM/YYYY') : 'New' }</span>
    </div>
    <div className="content">
      <ReactMarkdown>{comment}</ReactMarkdown>
    </div>
  </div>
)

class Comments extends Component {
  state = {
    expanded: !this.props.collapsed && some(this.props.comments, comment => comment.isNew),
    showPrevious: false
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
            (showPrevious || !active.length) && previous.map((comment, index) => <Comment index={index} key={index} { ...comment } user={this.props.user} />)
          }
          {
            !!active.length && !!previous.length && (
              <p><Button className="link" onClick={this.toggleShowPrevious}>{ showPrevious ? 'Hide' : 'Show' }</Button> {previous.length} previous comments</p>
            )
          }
          {
            active.map((comment, index) => <Comment index={index + (previous.length || 0)} key={index} { ...comment } user={this.props.user} />)
          }
          {
            commentable && <AddComment field={field} />
          }
        </Fragment>
      </ExpandingPanel>
    )
  }
}

const mapStateToProps = ({ comments, application: { commentable, showComments, user } }, { field }) => ({
  comments: comments[field],
  commentable,
  showComments,
  user
});

export default connect(mapStateToProps)(Comments);
