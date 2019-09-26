import { useEffect } from 'react';
import { withRouter } from 'react-router';

const ScrollToTop = ({ children, location }) => {

  useEffect(() => {
    const header = document.querySelector('.download-header');
    const top = header ? header.offsetTop : 0;
    window.scrollTo(0, top);
  }, [location]);

  return children;
}

export default withRouter(ScrollToTop);
