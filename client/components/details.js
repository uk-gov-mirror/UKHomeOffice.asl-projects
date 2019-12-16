import React, { useState } from 'react';

export default function Details({ summary, children }) {
  const [open, setOpen] = useState(false);

  function toggle() {
    setOpen(!open);
  }
  return (
    <details>
      <summary onClick={toggle}>{ summary }</summary>
      {
        open && children
      }
    </details>
  );
}
