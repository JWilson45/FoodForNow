// /src/components/Textarea.js

import PropTypes from 'prop-types';

export default function Textarea({
  id,
  name,
  value,
  onChange,
  placeholder = '',
  className = '',
  ...props
}) {
  return (
    <textarea
      id={id}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={`form-textarea ${className}`}
      {...props}
    ></textarea>
  );
}

Textarea.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  className: PropTypes.string,
};
