// /src/components/Button.js

'use client';

import { useRouter } from 'next/navigation';
import PropTypes from 'prop-types';

/**
 * Button Component
 *
 * A standard button component.
 */
export default function Button({
  children,
  onClick,
  type = 'button',
  className = '',
  href,
  disabled = false,
  ...props // Include props here for spreading
}) {
  const router = useRouter();

  const handleClick = (e) => {
    if (disabled) {
      e.preventDefault();
      return;
    }
    if (href) {
      e.preventDefault();
      router.push(href);
    }
    if (onClick) {
      onClick(e);
    }
  };

  return (
    <button
      type={type}
      onClick={handleClick}
      disabled={disabled}
      aria-disabled={disabled}
      className={`px-4 py-2 bg-button-blue hover:bg-button-blue-hover active:bg-button-blue-active text-white font-bold uppercase rounded-lg transition-transform transform hover:scale-105 active:scale-100 shadow-custom hover:shadow-custom-hover ${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      } ${className}`}
      {...props} // Spread additional props
    >
      {children}
    </button>
  );
}

Button.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
  type: PropTypes.string,
  className: PropTypes.string,
  href: PropTypes.string,
  disabled: PropTypes.bool,
};
