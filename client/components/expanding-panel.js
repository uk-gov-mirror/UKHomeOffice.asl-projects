import React, { useState, useRef, useEffect } from 'react';
import classnames from 'classnames';
import isUndefined from 'lodash/isUndefined';

import { getScrollPos } from '../helpers';

// H2 padding
const OFFSET = -15;

export default function ExpandingPanel(props) {
  const [open, setOpen] = useState(isUndefined(props.open) ? false : props.open);
  const ref = useRef(null);

  useEffect(() => {
    setOpen(props.open);
  }, [props.open]);

  function scrollToTop() {
    window.scrollTo({
      top: getScrollPos(ref.current, OFFSET)
    });
  }

  function toggle(e) {
    e.preventDefault();
    if (props.onToggle) {
      return props.onToggle();
    }
    return setOpen(!open);
  }

  function content() {
    return props.scrollToActive
      ? React.Children.map(props.children, child => React.cloneElement(child, { ...props, scrollToTop }))
      : props.children;
  }

  function closeLink() {
    if (!open || !props.closeLabel || props.pdf) {
      return null;
    }
    return (
      <p className="toggles">
        <a href="#" onClick={toggle}>{props.closeLabel}</a>
      </p>
    );
  }

  return (
    <section className={classnames('expanding-panel', { open }, props.className)}>
      <header onClick={toggle}>
        <h3 ref={ref}>{ props.title }</h3>
      </header>
      <div className={classnames('content', { hidden: !open })}>
        { open && content() }
      </div>
      { closeLink() }
    </section>
  );
}
