// /src/components/ProgressBar.js

'use client';
import PropTypes from 'prop-types';

/**
 * ProgressBar Component
 *
 * Displays a visual representation of password strength.
 */
export default function ProgressBar({ value, strength }) {
  const strengthClasses = {
    weak: 'bg-red-500',
    medium: 'bg-orange-500',
    strong: 'bg-green-500',
    'very-strong': 'bg-teal-500',
    default: 'bg-purple-500',
  };

  return (
    <div className="w-full bg-gray-700 rounded-full h-2.5 mb-4 border border-gray-600">
      <div
        className={`h-2.5 rounded-full transition-all duration-400 ease-in-out ${
          strengthClasses[strength] || strengthClasses.default
        }`}
        style={{ width: `${value}%` }}
      ></div>
    </div>
  );
}

ProgressBar.propTypes = {
  value: PropTypes.number.isRequired, // Percentage (e.g., 33, 66, 100)
  strength: PropTypes.string.isRequired, // 'weak', 'medium', 'strong', etc.
};
