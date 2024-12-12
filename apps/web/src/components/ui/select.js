import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

export const Select = ({
  children,
  value,
  onValueChange,
  className,
  ...props
}) => {
  return (
    <select
      value={value}
      onChange={(e) => onValueChange(e.target.value)}
      className={classNames(
        'block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary',
        className
      )}
      {...props}
    >
      {children}
    </select>
  );
};

Select.propTypes = {
  children: PropTypes.node.isRequired,
  value: PropTypes.string,
  onValueChange: PropTypes.func.isRequired,
  className: PropTypes.string,
};

export const SelectTrigger = ({ children, className, ...props }) => {
  return (
    <div
      className={classNames(
        'relative w-full border border-gray-300 bg-white rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

SelectTrigger.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

export const SelectContent = ({ children, className, ...props }) => {
  return (
    <div
      className={classNames(
        'absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

SelectContent.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

export const SelectItem = ({ children, value, className, ...props }) => {
  return (
    <option
      value={value}
      className={classNames(
        'cursor-default select-none relative py-2 pl-10 pr-4',
        className
      )}
      {...props}
    >
      {children}
    </option>
  );
};

SelectItem.propTypes = {
  children: PropTypes.node.isRequired,
  value: PropTypes.string.isRequired,
  className: PropTypes.string,
};

export const SelectTriggerWrapper = ({ children, className, ...props }) => {
  return (
    <div className={classNames('relative w-full', className)} {...props}>
      {children}
    </div>
  );
};

SelectTriggerWrapper.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

export const SelectValue = ({ placeholder, value, className, ...props }) => {
  return (
    <span className={classNames('block truncate', className)} {...props}>
      {value || placeholder}
    </span>
  );
};

SelectValue.propTypes = {
  placeholder: PropTypes.string,
  value: PropTypes.string,
  className: PropTypes.string,
};
