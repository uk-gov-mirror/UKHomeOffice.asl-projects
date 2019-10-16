import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';
import format from 'date-fns/format';
import ReactMarkdown from 'react-markdown';
import { Button } from '@ukhomeoffice/react-components';
import { deleteComment } from '../../actions/comments';

import { DATE_FORMAT } from '../../constants';

const Comment = ({
  field,
  author,
  createdAt,
  comment,
  id,
  index,
  isNew,
  user,
  deleted,
  deleteComment,
  editComment
}) => (
  <div className={classnames('comment', { isNew, mine: user === author, deleted })}>
    <div className="header">
      <strong>{`${index + 1}. ${author}`}</strong>
      {
        !deleted && <span className="float-right">{ createdAt ? format(createdAt, DATE_FORMAT.short) : 'New' }</span>
      }
    </div>
    <div className="content">
      {
        deleted
          ? <em>This comment has been deleted</em>
          : <ReactMarkdown>{comment}</ReactMarkdown>
      }

      {
        user === author && isNew && !deleted && (
          <Fragment>
            <Button className="link" onClick={() => editComment(id)}>Edit</Button>
            <Button className="link" onClick={() => deleteComment({ field, id })}>Delete</Button>
          </Fragment>
        )
      }
    </div>
  </div>
);

const mapStateToProps = ({ application: { user } }) => ({ user });

export default connect(mapStateToProps, { deleteComment })(Comment);
