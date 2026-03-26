import React from 'react';
import './Button.css';

function Button({
  children,
  variant = 'primary',     // primary | secondary | text-primary | text-secondary | underline
  size = 'default',        // default | small
  state = 'default',       // default | hover | pressed | disabled
  onClick
}) {
  const classes = [
    'btn',
    `btn--${variant}`,
    `btn--${size}`,
    `btn--${state}`,
  ].join(' ');

  return (
    <button className={classes} onClick={onClick} disabled={state === 'disabled'}>
      {children}
    </button>
  );
}

export default Button;
