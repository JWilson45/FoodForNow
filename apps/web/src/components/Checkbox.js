// /src/components/Checkbox.js

import PropTypes from 'prop-types';

export default function Checkbox({
  id,
  name,
  checked,
  onChange,
  label,
  className = '',
  ...props
}) {
  return (
    <div className={`flex items-center ${className}`}>
      <input
        type="checkbox"
        id={id}
        name={name}
        checked={checked}
        onChange={onChange}
        className="mr-2"
        {...props}
      />
      <label htmlFor={id} className="text-gray-300 cursor-pointer">
        {label}
      </label>
    </div>
  );
}

Checkbox.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  checked: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
  className: PropTypes.string,
};
