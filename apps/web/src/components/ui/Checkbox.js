'use client';

import React from 'react';
import PropTypes from 'prop-types';

export function Checkbox({ id, checked, onCheckedChange, ...props }) {
  return (
    <input
      type="checkbox"
      id={id}
      checked={checked}
      onChange={(e) => onCheckedChange(e.target.checked)}
      {...props}
    />
  );
}

Checkbox.propTypes = {
  id: PropTypes.string.isRequired,
  checked: PropTypes.bool.isRequired,
  onCheckedChange: PropTypes.func.isRequired,
};
