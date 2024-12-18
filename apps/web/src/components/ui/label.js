// /src/components/Label.js

'use client';

import PropTypes from 'prop-types';

/**
 * Label Component
 *
 * A standard label component.
 */
export default function Label({ htmlFor, children, className = '', ...props }) {
  return (
    <label
      htmlFor={htmlFor}
      className={`block mb-2 text-gray-300 font-semibold ${className}`}
      {...props}
    >
      {children}
    </label>
  );
}

Label.propTypes = {
  htmlFor: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};
