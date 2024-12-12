'use client';

import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

/**
 * Label Component
 *
 * A reusable label component for form inputs.
 */
export const Label = ({ htmlFor, children, className, ...props }) => {
  return (
    <label
      htmlFor={htmlFor}
      className={classNames(
        'block text-sm font-medium text-gray-700',
        className
      )}
      {...props}
    >
      {children}
    </label>
  );
};

Label.propTypes = {
  htmlFor: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};
