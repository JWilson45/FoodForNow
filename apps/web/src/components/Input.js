// /src/components/Input.js

import PropTypes from 'prop-types';

/**
 * Input Component
 *
 * A reusable input field component.
 */
export default function Input({
  id,
  name,
  type = 'text',
  required = false,
  value,
  onChange,
  placeholder = '',
  className = '',
  ...props
}) {
  return (
    <input
      type={type}
      id={id}
      name={name}
      placeholder={placeholder}
      required={required}
      value={value}
      onChange={onChange}
      className={`form-input ${className}`}
      {...props}
    />
  );
}

Input.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  type: PropTypes.string,
  required: PropTypes.bool,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.bool,
  ]).isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  className: PropTypes.string,
};
