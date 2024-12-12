'use client';

import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

/**
 * Input Component
 *
 * A reusable input component with consistent styling.
 */
export const Input = ({
  type = 'text',
  id,
  name,
  value,
  onChange,
  placeholder,
  required = false,
  className,
  ...props
}) => {
  return (
    <input
      type={type}
      id={id}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      className={classNames(
        'block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm',
        className
      )}
      {...props}
    />
  );
};

Input.propTypes = {
  type: PropTypes.string,
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  required: PropTypes.bool,
  className: PropTypes.string,
};
