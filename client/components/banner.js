import React from 'react';
import classnames from 'classnames';

class Banner extends React.Component {

  render() {
    return <div className={classnames('banner', this.props.className)}>
      { this.props.children }
    </div>;
  }

}

export default Banner;
