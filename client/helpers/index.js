import { withRouter } from 'react-router';
import { connect } from 'react-redux';

const mapStateToProps = (state, props) => {
  const { id } = props.match.params;
  return {
    project: state.projects.find(p => p.id === parseInt(id, 10)) || {}
  };
}

export const connectProject = Component => withRouter(connect(mapStateToProps)(Component));

export const getScrollPos = (elem, offset) => {
  const box = elem.getBoundingClientRect();
  const body = document.body;
  const docEl = document.documentElement;
  const scrollTop = window.pageYOffset || docEl.scrollTop || body.scrollTop;
  const clientTop = docEl.clientTop || body.clientTop || 0;

  return Math.round(box.top + scrollTop - clientTop) + offset;
};
