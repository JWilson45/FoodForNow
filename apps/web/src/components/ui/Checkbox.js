// /src/components/ui/Checkbox.js

'use client';

import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

/**
 * UICheckbox Component
 *
 * A styled checkbox component.
 */
export const UICheckbox = ({
  id,
  name,
  checked,
  onChange,
  label,
  className,
  ...props
}) => {
  return (
    <div className={classNames('flex items-center', className)} {...props}>
      <input
        type="checkbox"
        id={id}
        name={name}
        checked={checked}
        onChange={onChange}
        className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
      />
      {label && (
        <label htmlFor={id} className="ml-2 text-sm font-medium text-gray-300">
          {label}
        </label>
      )}
    </div>
  );
};

UICheckbox.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  checked: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  label: PropTypes.string,
  className: PropTypes.string,
};
