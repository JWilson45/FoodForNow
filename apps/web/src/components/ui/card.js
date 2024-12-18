// /src/components/ui/card.js

import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

/**
 * Card Component
 *
 * A container component with a consistent style.
 */
export const Card = ({ children, className, ...props }) => {
  return (
    <div
      className={classNames(
        'bg-white rounded-lg shadow-md overflow-hidden',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

Card.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

/**
 * CardHeader Component
 *
 * The header section of the card.
 */
export const CardHeader = ({ children, className, ...props }) => {
  return (
    <div
      className={classNames('px-6 py-4 border-b border-gray-200', className)}
      {...props}
    >
      {children}
    </div>
  );
};

CardHeader.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

/**
 * CardTitle Component
 *
 * The title section of the card.
 */
export const CardTitle = ({ children, className, ...props }) => {
  return (
    <h2
      className={classNames('text-xl font-semibold text-gray-800', className)}
      {...props}
    >
      {children}
    </h2>
  );
};

CardTitle.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

/**
 * CardDescription Component
 *
 * The description section of the card.
 */
export const CardDescription = ({ children, className, ...props }) => {
  return (
    <p className={classNames('text-sm text-gray-600', className)} {...props}>
      {children}
    </p>
  );
};

CardDescription.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

/**
 * CardContent Component
 *
 * The main content area of the card.
 */
export const CardContent = ({ children, className, ...props }) => {
  return (
    <div className={classNames('px-6 py-4', className)} {...props}>
      {children}
    </div>
  );
};

CardContent.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

/**
 * CardFooter Component
 *
 * The footer section of the card.
 */
export const CardFooter = ({ children, className, ...props }) => {
  return (
    <div
      className={classNames('px-6 py-4 border-t border-gray-200', className)}
      {...props}
    >
      {children}
    </div>
  );
};

CardFooter.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};
