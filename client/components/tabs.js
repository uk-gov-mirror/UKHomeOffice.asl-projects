import React from 'react';
import classnames from 'classnames';

const Tabs = ({ active, children }) => (
  <nav className="govuk-tabs">
    <ul>
      {
        React.Children.map(children, (child, index) => (
          <li className={classnames({ active: index === active })}>{ child }</li>
        ))
      }
    </ul>
  </nav>
);

export default Tabs;
