import { withRouter } from 'react-router';
import { connect } from 'react-redux';

const mapStateToProps = (state, props) => {
  const { id } = props.match.params;
  return {
    project: state.projects.find(p => p.id === parseInt(id, 10))
  };
}

export const connectProject = Component => withRouter(connect(mapStateToProps)(Component));
