import React, { useState, useRef } from 'react';
import classnames from 'classnames';

import { getScrollPos } from '../helpers';

// H2 padding
const OFFSET = -15;

export default function ExpandingPanel(props) {
  const [open, setOpen] = useState(props.open || false);
  const ref = useRef(null);

  const controlled = typeof props.open === 'boolean';

  function scrollToTop() {
    window.scrollTo({
      top: getScrollPos(ref.current, OFFSET)
    })
  }

  function toggle() {
    if (controlled) {
      return props.onToggle();
    }
    return setOpen(!open);
  }

  function isOpen() {
    if (controlled) {
      return props.open;
    }
    return open;
  }

  function content() {
    if (!isOpen()) {
      return null;
    }
    return props.scrollToActive
      ? React.Children.map(props.children, child => React.cloneElement(child, { ...props, scrollToTop }))
      : props.children
  }

  return (
    <section className={classnames('expanding-panel', { open: isOpen() }, props.className)}>
      <header onClick={() => toggle()}>
        <h3 ref={ref}>{ props.title }</h3>
      </header>
      <div className={classnames('content', { hidden: !isOpen() })}>
        { content() }
      </div>
    </section>
  )
}
