import { useEffect } from 'react';
import { withRouter } from 'react-router';

const ScrollToTop = ({ children, location }) => {

  useEffect(() => {
    const header = document.querySelector('.document-header');
    const top = header ? header.offsetTop : 0;
    window.scrollTo(0, top);
  }, [location.pathname]);

  return children;
};

export default withRouter(ScrollToTop);
