'use client';

import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

/**
 * Textarea Component
 *
 * A reusable textarea component with consistent styling.
 */
export const Textarea = ({
  id,
  name,
  value,
  onChange,
  placeholder,
  required = false,
  className,
  rows = 4,
  ...props
}) => {
  return (
    <textarea
      id={id}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      rows={rows}
      className={classNames(
        'block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm',
        className
      )}
      {...props}
    />
  );
};

Textarea.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  required: PropTypes.bool,
  className: PropTypes.string,
  rows: PropTypes.number,
};
