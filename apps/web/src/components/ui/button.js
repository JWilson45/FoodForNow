// /src/components/ui/button.js

'use client';

import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

/**
 * UIButton Component
 *
 * A styled button component with variants and sizes.
 */
export const UIButton = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  className,
  ...props
}) => {
  const variants = {
    primary: 'bg-blue-500 text-white hover:bg-blue-600',
    secondary: 'bg-gray-500 text-white hover:bg-gray-600',
    outline: 'border border-gray-500 text-gray-500 hover:bg-gray-100',
    destructive: 'bg-red-500 text-white hover:bg-red-600',
  };

  const sizes = {
    sm: 'px-2 py-1 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
    icon: 'p-2', // Added for icon buttons
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={classNames(
        'rounded focus:outline-none focus:ring',
        variants[variant],
        sizes[size],
        {
          'opacity-50 cursor-not-allowed': disabled,
        },
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

UIButton.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
  variant: PropTypes.oneOf(['primary', 'secondary', 'outline', 'destructive']),
  size: PropTypes.oneOf(['sm', 'md', 'lg', 'icon']),
  disabled: PropTypes.bool,
  className: PropTypes.string,
};
