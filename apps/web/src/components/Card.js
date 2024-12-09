// /src/components/Card.js

import PropTypes from 'prop-types';

export default function Card({ title, children, className = '' }) {
  return (
    <div
      className={`bg-black/80 border-2 border-button-blue rounded-xl p-6 shadow-custom hover:shadow-custom-hover transition-shadow ${className}`}
    >
      <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
      {children}
    </div>
  );
}

Card.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};
